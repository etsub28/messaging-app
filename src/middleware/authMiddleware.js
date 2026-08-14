const prisma = require("../config/prisma");

async function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    prisma.user
      .update({
        where: { id: req.user.id },
        data: { lastSeen: new Date() },
      })
      .catch((err) => console.error("Failed to update lastSeen:", err));

    return next();
  }
  res.status(401).json({ error: "You must be logged in to access this" });
}

module.exports = { ensureAuthenticated };
