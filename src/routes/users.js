const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const { updateProfile, uploadAvatar, getUserById, getAllUsers } = require("../controllers/userController");
const upload = require("../middleware/upload");

router.get("/", (req, res) => {
  res.send("Users route working");
});

router.get("/me", ensureAuthenticated, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    bio: req.user.bio,
    avatarUrl: req.user.avatarUrl,
  });
});

router.put("/me", ensureAuthenticated, updateProfile);

router.post("/me/avatar", ensureAuthenticated, (req, res, next) => {
  upload.single("avatar")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, uploadAvatar);

router.get("/all", ensureAuthenticated, getAllUsers);
router.get("/:id", ensureAuthenticated, getUserById);

module.exports = router;

