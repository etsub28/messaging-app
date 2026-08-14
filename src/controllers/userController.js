const prisma = require("../config/prisma");

async function updateProfile(req, res) {
  try {
    const { username, bio } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;

    if (username) {
      const existing = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: req.user.id },
        },
      });
      if (existing) {
        return res.status(409).json({ error: "Username already taken" });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function uploadAvatar(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
    });

    res.json({
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      bio: updatedUser.bio,
      avatarUrl: updatedUser.avatarUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getUserById(req, res) {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      where: { NOT: { id: req.user.id } },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

module.exports = { updateProfile, uploadAvatar, getUserById, getAllUsers };
