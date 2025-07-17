import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ success: false, message: "no token found" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
    if (err) {
      res.status(403).json({
        success: false,
        message: "invalid or expired token ",
      });
    }
    req.user = decode;
  });
  next();
};

export default authMiddleware;
