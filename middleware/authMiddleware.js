// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check for token in header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied", success: false });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   req.user = {
  id: decoded.userId,
  role: decoded.role,
  companyId: decoded.companyId
};


    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", success: false });
  }
};

module.exports = authenticate;
