import dotenv from "dotenv"
import { Request, Response } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUserInput, IUserOutput } from "../models/User.js";
import { Role } from "../models/User.js";
import { generateTokens, verifyRefreshToken } from "../utils/generateTokens.js";

dotenv.config()

type LoginUserType = Pick<IUserInput, "email" | "password">

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL

export const register = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Неверные данные" })
        }

        const user = await User.findOne({ email })

        if (user) {
            return res.status(409).json({ error: "Пользователь с таким E-Mail существует" })
        }

        const hashPassword = bcrypt.hashSync(password, 10)
        const role: Role = email === ADMIN_EMAIL ? "admin" : "user"

        const newUser: IUserInput = {
            fullname,
            email,
            role,
            password: hashPassword
        }

        await User.create(newUser)

        return res.json({ message: "Пользователь успешно зарегестрирован" })
    } catch (err) {
        return res.status(500).json({ error: "Registration Server Error " + err })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: "Неверные данные" })
        }

        const user = await User.findOne({ email }).select("+password") as IUserOutput

        if (!user) {
            return res.status(400).json({ error: "Пользователя с таким E-Mail не существует" })
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({ error: "Неверный E-Mail или пароль" })
        }

        const { accessToken, refreshToken } = generateTokens({userID: user._id })
        
        user.refreshToken = refreshToken
        await user.save()

        res.cookie("refreshToken", refreshToken, cookieOptions)

        return res.json({ accessToken })


    } catch (err) {
        return res.status(500).json({ error: "Server Error " + err })
    }
}

export const refresh = async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken
    if (!token) return res.status(400).json({ error: "Токен не найден" })

    try {
        const payload = verifyRefreshToken(token)
        const user = await User.findById(payload.userID)

        if (!user) return res.status(404).json({ error: "Пользователь не найден" })
        if (user.refreshToken !== token) return res.status(400).json({ error: "Токен не валиден" })

        const { accessToken, refreshToken } = generateTokens({ userID: user._id })

        user.refreshToken = refreshToken
        await user.save()

        res.cookie("refreshToken", refreshToken, cookieOptions)

        return res.json({ accessToken })
    } catch (err) {
        return res.status(500).json({ error: "Server Error " + err })
    }
}

export const authorization = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.userID)
        if (!user) return res.status(404).json({ error: "Пользователя не существует" })
        return res.json({ user })
    } catch (err) {
        return res.status(500).json({ error: "Authorization Server Error " + err })
    }
}

export const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    try {
        if (!refreshToken) return res.status(400).json({ error: "Нет токена" })
        
        await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } })
        res.clearCookie("refreshToken")

        return res.json({ message: "Success" }) 
    } catch (err) {
        return res.status(500).json({ error: "Authorization Server Error " + err })
    }
}