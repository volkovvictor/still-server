import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Role } from "../models/User.js";

export interface TokenPayload {
    userID: Types.ObjectId
}

const ACCESS_SECRET = process.env.ACCESS_SECRET as string
const REFRESH_SECRET = process.env.REFRESH_SECRET as string

export const generateTokens = (payload: TokenPayload) => {
    const accessToken = jwt.sign(payload, ACCESS_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign(payload, REFRESH_SECRET, {
        expiresIn: "7d"
    })

    return { accessToken, refreshToken }
}

export const verifyAccessToken = (token: string) => {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload
}

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload
}