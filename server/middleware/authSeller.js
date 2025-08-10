import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  if (!sellerToken) {
    return res.status(400).json({ message: "seller not authorized" });
  }
  try {
    const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
        next();
    } else {
      return res.status(400).json({ message: "not authorized" });
    }
    
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export default authSeller;
