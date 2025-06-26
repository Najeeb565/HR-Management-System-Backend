// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded; // 👈 Now you can access req.user.companyId
    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;
