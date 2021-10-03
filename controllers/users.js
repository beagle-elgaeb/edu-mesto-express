const User = require("../models/users");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.getUsersId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ error: "Пользователь не найден" });
        return;
      }

      res.send(user);
    })
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    res.status(400).send({ error: "Переданы некорректные данные" });
    return;
  }

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.updateProfile = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  if (!name || !about) {
    res.status(400).send({ error: "Переданы некорректные данные" });
    return;
  }

  User.findByIdAndUpdate(_id, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ error: "Пользователь не найден" });
        return;
      }

      res.send(user);
    })
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.updateAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  if (!avatar) {
    res.status(400).res.send({ error: "Переданы некорректные данные" });
    return;
  }

  User.findByIdAndUpdate(_id, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ error: "Пользователь не найден" });
        return;
      }

      res.send(user);
    })
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};
