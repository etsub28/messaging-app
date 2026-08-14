const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendsList,
  getPendingRequests,
} = require("../controllers/friendController");

router.post("/request", ensureAuthenticated, sendFriendRequest);
router.post("/request/:requestId", ensureAuthenticated, respondToFriendRequest);
router.get("/", ensureAuthenticated, getFriendsList);
router.get("/pending", ensureAuthenticated, getPendingRequests);

module.exports = router;