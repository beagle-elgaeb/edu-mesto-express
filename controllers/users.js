const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const Unauthorized = require("../errors/unauthorized-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      next(new ConflictError("Этот пользователь уже зарегистрирован"));
      return;
    }

    if (err.name === "ValidationError") {
      next(new BadRequestError("Переданы некорректные данные"));
      return;
    }

    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user) {
      throw new Unauthorized("Ошибка авторизации");
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      { expiresIn: "7d" },
    );

    res
      .cookie("jwt", token, { httpOnly: true, maxAge: 7 * 24 * 3600 * 1000 })
      .send({ message: "Авторизация выполнена" });
  } catch (err) {
    next(err);
  }
};

module.exports.getUser = async (req, res, next) => {
  const userId = req.params.id ?? req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("Пользователь не найден");
    }

    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Невалидный id"));
      return;
    }

    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  try {
    if (!name || !about) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    const userProfile = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    );

    res.send(userProfile);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Переданы некорректные данные"));
      return;
    }

    if (err.name === "CastError") {
      next(new BadRequestError("Невалидный id"));
      return;
    }

    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError("Переданы некорректные данные");
  }

  try {
    const userAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    );

    res.send(userAvatar);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Переданы некорректные данные"));
      return;
    }

    if (err.name === "CastError") {
      next(new BadRequestError("Невалидный id"));
      return;
    }

    next(err);
  }
};
