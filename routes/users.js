const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { getUsers, getUser, updateProfile, updateAvatar } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(auth);

router.get("/", getUsers);
router.get("/me", getUser);
router.patch(
  "/me",
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
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().required().uri(),
    }),
  }),
  updateAvatar,
);

module.exports = router;
