const Card = require("../models/cards");

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.createCard = async (req, res) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: _id });
    res.send(card);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      res.status(404).send({ error: "Карточка не найдена" });
      return;
    }

    res.send(card);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Невалидный id" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.likeCard = async (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id } }, { new: true });

    if (!card) {
      res.status(404).send({ error: "Карточка не найдена" });
      return;
    }

    res.send(card);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Невалидный id" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(cardId, { $pull: { likes: _id } }, { new: true });

    if (!card) {
      res.status(404).send({ error: "Карточка не найдена" });
      return;
    }

    res.send(card);
  } catch (err) {
    if (err.name === "CastError") {
      res.status(400).send({ message: "Невалидный id" });
      return;
    }

    res.status(500).send({ message: "Сервер не может обработать запрос" });
  }
};
