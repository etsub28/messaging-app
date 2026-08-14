const prisma = require("../config/prisma");

const ONLINE_THRESHOLD_MS = 30 * 1000; // 30 seconds

function isOnline(lastSeen) {
  return Date.now() - new Date(lastSeen).getTime() < ONLINE_THRESHOLD_MS;
}

async function sendFriendRequest(req, res) {
  try {
    const addresseeId = Number(req.body.addresseeId);

    if (addresseeId === req.user.id) {
      return res.status(400).json({ error: "You cannot friend yourself" });
    }

    const addressee = await prisma.user.findUnique({ where: { id: addresseeId } });
    if (!addressee) {
      return res.status(404).json({ error: "User not found" });
    }

    const existing = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId: req.user.id, addresseeId },
          { requesterId: addresseeId, addresseeId: req.user.id },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({ error: "Friend request already exists" });
    }

    const friendship = await prisma.friendship.create({
      data: {
        requesterId: req.user.id,
        addresseeId,
        status: "pending",
      },
    });

    res.status(201).json(friendship);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function respondToFriendRequest(req, res) {
  try {
    const requestId = Number(req.params.requestId);
    const { action } = req.body; // "accept" or "reject"

    const friendship = await prisma.friendship.findUnique({ where: { id: requestId } });

    if (!friendship || friendship.addresseeId !== req.user.id) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    if (action === "accept") {
      const updated = await prisma.friendship.update({
        where: { id: requestId },
        data: { status: "accepted" },
      });
      return res.json(updated);
    }

    if (action === "reject") {
      await prisma.friendship.delete({ where: { id: requestId } });
      return res.json({ message: "Friend request rejected" });
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getFriendsList(req, res) {
  try {
    const friendships = await prisma.friendship.findMany({
      where: {
        status: "accepted",
        OR: [{ requesterId: req.user.id }, { addresseeId: req.user.id }],
      },
      include: {
        requester: { select: { id: true, username: true, avatarUrl: true, lastSeen: true } },
        addressee: { select: { id: true, username: true, avatarUrl: true, lastSeen: true } },
      },
    });

    const friends = friendships.map((f) => {
      const friend = f.requesterId === req.user.id ? f.addressee : f.requester;
      return {
        id: friend.id,
        username: friend.username,
        avatarUrl: friend.avatarUrl,
        online: isOnline(friend.lastSeen),
      };
    });

    res.json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getPendingRequests(req, res) {
  try {
    const requests = await prisma.friendship.findMany({
      where: {
        addresseeId: req.user.id,
        status: "pending",
      },
      include: {
        requester: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = {
  sendFriendRequest,
  respondToFriendRequest,
  getFriendsList,
  getPendingRequests,
};