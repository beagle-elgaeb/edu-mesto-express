const Card = require("../models/cards");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");
const ForbiddenError = require("../errors/forbidden-err");

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });

    if (!card) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    if (cardId !== req.user._id) {
      throw new ForbiddenError("Для этого действия недостаточно прав");
    }

    const card = await Card.findByIdAndRemove(cardId);

    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError("Карточка не найдена");
    }

    res.send(card);
  } catch (err) {
    next(err);
  }
};
