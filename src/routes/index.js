const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Messaging app is alive 🚀");
});

module.exports = router;