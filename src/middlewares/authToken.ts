import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { IUserInput } from "../models/User.js";
import { verifyAccessToken } from "../utils/generateTokens.js";

const SESSION_SECRET = process.env.SESSION_SECRET

const authToken = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization

    if (!header?.startsWith("Bearer")) return res.status(400).json({ error: "Нет токена" })
    
    const token = header.split(" ")[1] as string

    try {
        const payload = verifyAccessToken(token)
        req.userID = payload.userID
        next()
    } catch (err) {
        return res.status(500).json({ error: "Authorization Server Error " + err })
    }
}

export default authToken