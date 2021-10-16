const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const Unauthorized = require("../errors/unauthorized-err");

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    next(err);
  }
};

module.exports.getUsersId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("Пользователь не найден");
    }

    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.createUser = async (req, res, next) => {
  const { name, about, avatar } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    res.send(user);
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      throw new ConflictError("Этот пользователь уже зарегистрирован");
    }

    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });

    res
      .cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 3600 * 1000 })
      .send({ message: "Авторизация выполнена" });

    throw new Unauthorized("Ошибка авторизации");
  } catch (err) {
    next(err);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  if (!name || !about) {
    throw new BadRequestError("Переданы некорректные данные");
  }

  try {
    const userProfile = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true },
    );

    res.send(userProfile);
  } catch (err) {
    next(err);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  if (!avatar) {
    throw new BadRequestError("Переданы некорректные данные");
  }

  try {
    const userAvatar = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true },
    );

    res.send(userAvatar);
  } catch (err) {
    next(err);
  }
};
