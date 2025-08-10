import jwt from "jsonwebtoken";

// Seller Login : /api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("sellerToken", token, {
        httpOnly: true, //PREVENT JAVASCRIPT TO ACCESS COOKIE
        secure: process.env.NODE_ENV === "production", //USE SECURE COOKIE IN PRODUCTION
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", //CSRF PROTECTION
        maxAge: 7 * 24 * 60 * 60 * 1000, //COOKIE EXPIRATION TIME IN MILLISEC
      });

      return res.json({success:true, message: "logged in" });
    } else {
      return res.status(400).json({ message: "invalid credentials"});
    }
  } catch (error) {
    return res.status(400).json({ message: error.message});
  }
};

// Seller isAuth : api/seller/is-Auth
export const isSellerAuth = async(req,res)=>{
    try{
        return res.status(200).json({success:true})
    }
    catch(error){
        res.status(400).json({message:error.message})
    }
}

// Logout Seller : api/seller/logout
export const sellerLogout = async(req,res)=>{
    try{
        res.clearCookie('sellerToken',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:process.env.NODE_ENV === 'production'?'none':'strict'

        })
        return res.status(200).json({success:true,message:"Logged out"})
    } catch(error){
        console.log(error.message)
        res.status(400).json({message:error.message})
    }
}
