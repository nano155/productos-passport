import { JwtAdapter } from "../config/jwt.adapter.js"




export class AuthValidate {

    static validateToken =async (req, res, next)=>{

        const {token} = req.cookies
        
        if(!token) return res.status(401).json({message: 'No token, authorization denied'})

        const isMatch = await JwtAdapter.verifyToken(token)
        
        if(!isMatch) return res.status(403).json({message:"Invalid token"})

        req.user = isMatch
        
        next()
    }
}