import jwt from 'jsonwebtoken'
import {config} from 'dotenv'

config()
const validateJWT = (req, res, next) => {
    const token = req.cookies   
    if(!token){
        return res.status(401).json({message : "No token, Authorization denied"})
    }
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = payload
        next()
    } catch (error) {
        res.status(403).json({message : "Invalid token"})
    }
}

export default validateJWT