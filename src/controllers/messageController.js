const prisma = require("../config/prisma");

async function sendMessage(req, res) {
  try {
    const { receiverId, content } = req.body;
    const imageUrl = req.file ? `/uploads/messages/${req.file.filename}` : null;

    if (!receiverId) {
      return res.status(400).json({ error: "receiverId is required" });
    }

    if (!content && !imageUrl) {
      return res.status(400).json({ error: "Message must have text or an image" });
    }

    if (content && content.length > 2000) {
      return res.status(400).json({ error: "Message is too long (max 2000 characters)" });
    }

    if (Number(receiverId) === req.user.id) {
      return res.status(400).json({ error: "You cannot message yourself" });
    }

    const receiver = await prisma.user.findUnique({
      where: { id: Number(receiverId) },
    });

    if (!receiver) {
      return res.status(404).json({ error: "Receiver not found" });
    }

    const message = await prisma.message.create({
      data: {
        content: content ? content.trim() : null,
        imageUrl,
        senderId: req.user.id,
        receiverId: Number(receiverId),
      },
    });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { sendMessage };

async function getConversation(req, res) {
  try {
    const otherUserId = Number(req.params.userId);
    const limit = 20;
    const cursor = req.query.cursor ? Number(req.query.cursor) : null;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: req.user.id },
        ],
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    const hasMore = messages.length === limit;

    res.json({
      messages: messages.reverse(), // reverse to chronological order for display
      hasMore,
      nextCursor: hasMore ? messages[messages.length - 1].id : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { sendMessage, getConversation };

async function getConversationsList(req, res) {
  try {
    const userId = req.user.id;

    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true, avatarUrl: true } },
        receiver: { select: { id: true, username: true, avatarUrl: true } },
      },
    });

    const conversationsMap = new Map();

    for (const msg of messages) {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.senderId,
          },
        });
      }
    }

    res.json(Array.from(conversationsMap.values()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { sendMessage, getConversation, getConversationsList };

