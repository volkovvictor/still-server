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