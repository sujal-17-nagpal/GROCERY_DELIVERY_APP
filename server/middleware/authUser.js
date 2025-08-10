import jwt from 'jsonwebtoken';

const authUser = (req,res,next) => {
    // console.log(">>>>>>>>>>>>>>>>>>")
    
    const {token} = req.cookies;
    // console.log(req.cookies)
    // console.log(req.body)

    if(!token){
        return res.status(400).json({message:"user not authorized"})
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        // console.log(req.body)
        if(tokenDecode.id){
            req.userId = tokenDecode.id
            // console.log(req.userId)
        } else{
            return res.status(400).json({message:"not authorized"})
        }
        next()
    } catch(error){
        return res.status(400).json({message:error.message})
    }
}

export default authUser