import dotenv from "dotenv"
import { Request, Response } from "express";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { IUserInput, IUserOutput } from "../models/User.js";

dotenv.config()

type LoginUserType = Pick<IUserInput, "email" | "password">

const SESSION_SECRET = process.env.SESSION_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

export const register = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password } = req.body as IUserInput
        const isUserExist = await User.findOne({ email })

        console.log('isUserExist', isUserExist)

        if (isUserExist) {
            return res.status(400).json({ error: "User exists" })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = User.create({ fullname, email, password: passwordHash })

        return res.json(newUser)

    } catch (err) {
        return res.status(500).json({ error: "Register Server Error " + err })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as LoginUserType
        const user = await User.findOne({ email }).select('+password')
        console.log('user', user)

        if (!user) {
            return res.status(400).json({ error: "Password or email is not correct" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user?.password )

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Password or email is not correct" })
        }

        const accessToken = jwt.sign(
            {
                email,
                password
            },
            SESSION_SECRET as string,
            {
                expiresIn: "15m"
            }
        )
        const refreshToken = jwt.sign(
            {
                email,
                password
            },
            REFRESH_SECRET as string,
            {
                expiresIn: "30d"
            }
        )

        user.refreshToken = refreshToken
        user.save()

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        return res.json({ accessToken })


    } catch (err) {
        return res.status(500).json({ error: "Login Server Error " + err })
    }
}