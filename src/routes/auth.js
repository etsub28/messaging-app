const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const { signup } = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid email or password" });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    });
  })(req, res, next);
});

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out successfully" });
  });
});

module.exports = router;

