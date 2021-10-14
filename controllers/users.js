const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.getUsersId = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).send({ error: "Пользователь не найден" });
      return;
    }

    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Невалидный id" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.createUser = async (req, res) => {
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

    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, "some-secret-key", { expiresIn: "7d" });

    res.cookie("jwt", token, { httpOnly: true, secure: true, maxAge: 7 * 24 * 3600 * 1000 });
  } catch (err) {
    res.status(401).send({ message: "Ошибка авторизации" });
  }
};

module.exports.updateProfile = async (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  if (!name || !about) {
    res.status(400).send({ error: "Переданы некорректные данные" });
    return;
  }

  try {
    const userProfile = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!userProfile) {
      res.status(404).send({ error: "Пользователь не найден" });
      return;
    }

    res.send(userProfile);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
      return;
    }

    if (err.name === "CastError") {
      res.status(400).send({ message: "Невалидный id" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).res.send({ error: "Переданы некорректные данные" });
    return;
  }

  try {
    const userAvatar = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!userAvatar) {
      res.status(404).send({ error: "Пользователь не найден" });
      return;
    }

    res.send(userAvatar);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
      return;
    }

    if (err.name === "CastError") {
      res.status(400).send({ message: "Невалидный id" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};
