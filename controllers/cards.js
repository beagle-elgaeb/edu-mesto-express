const Card = require("../models/cards");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.createCard = (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  if (!name || !link) {
    res.status(400).send({ error: "Переданы некорректные данные" });
    return;
  }

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ error: "Карточка не найдена" });
        return;
      }

      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ error: "Карточка не найдена" });
        return;
      }

      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};

module.exports.dislikeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true })
    .then((card) => {
      if (!card) {
        res.status(404).send({ error: "Карточка не найдена" });
        return;
      }

      res.send(card);
    })
    .catch((err) => res.status(500).send({ message: "Сервер не может обработать запрос" }));
};
