const router = require("express").Router();
const { getUsers, getUsersId, updateProfile, updateAvatar } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", auth, getUsers);
router.get("/:userId", auth, getUsersId);
router.patch("/me", auth, updateProfile);
router.patch("/me/avatar", auth, updateAvatar);

module.exports = router;
