import { Request, Response } from "express";
import { IUserInput, User } from "../models/User.js";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        return res.json(users)
    } catch (err) {
        return res.status(400).json("Server error, cannot get users: " + err)
    }
}

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        return res.json(user)
    } catch (err) {
        return res.status(500).json("Server error, cannot get user: " + err)
    }
}