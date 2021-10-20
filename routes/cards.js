const router = require("express").Router();
const valid = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.use(auth);

router.get("/", getCards);
router.post("/", valid.validCard, createCard);
router.delete("/:cardId", valid.validId, deleteCard);
router.put("/:cardId/likes", valid.validId, likeCard);
router.delete("/:cardId/likes", valid.validId, dislikeCard);

module.exports = router;
