const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const { sendMessage, getConversation, getConversationsList } = require("../controllers/messageController");
const messageUpload = require("../middleware/messageUpload");

router.get("/", (req, res) => {
  res.send("Messages route working");
});

router.post(
  "/",
  ensureAuthenticated,
  (req, res, next) => {
    messageUpload.single("image")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  sendMessage
);

router.get("/conversations", ensureAuthenticated, getConversationsList);
router.get("/:userId", ensureAuthenticated, getConversation);

module.exports = router;

