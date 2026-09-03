import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUserInput } from "../models/User.js";

const SESSION_SECRET = process.env.SESSION_SECRET

const authToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers['authorization']?.split(' ')[1]
        
        if (!accessToken) {
            return res.status(400).json({ error: "Access token not received" })
        }

        jwt.verify(accessToken, process.env.SESSION_SECRET as string, (err, user) => {
            
            const expiredErr = err && err.message.includes('jwt expired')
            const tokenErr = err && err.message.includes('invalid')

            if (tokenErr) {
                throw new Error(err.message)
            }

            if (expiredErr) {
            }

            req.user = user as IUserInput
            next()

        })
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}

export default authToken