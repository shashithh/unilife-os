const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "❌ Not authorized (missing token)" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "❌ Not authorized (invalid token)" });
  }
};