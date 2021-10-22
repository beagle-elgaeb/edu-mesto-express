const router = require("express").Router();
const valid = require("../middlewares/validation");
const auth = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  updateProfile,
  updateAvatar,
} = require("../controllers/users");

router.use(auth);

router.get("/", getUsers);
router.get("/me", getUser);
router.get("/:id", valid.validId, getUser);
router.patch("/me", valid.validUser, updateProfile);
router.patch("/me/avatar", valid.validAvatar, updateAvatar);

module.exports = router;
