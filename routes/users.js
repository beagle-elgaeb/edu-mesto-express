const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUsersId, updateProfile, updateAvatar,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", auth, getUsers);
router.get("/:userId", auth, getUsersId);
router.patch(
  "/me",
  auth,
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateProfile,
);
router.patch(
  "/me/avatar",
  auth,
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }),
  updateAvatar,
);

module.exports = router;
