import { Request, Response } from "express";
import { IUserInput, User } from "../models/User.js";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch(err) {
        return res.status(500).json({ error: `Server Error; ${err}` })
    }
}

export const createUser = async (req: Request, res: Response) => {
    try {

        const data: IUserInput = {
            fullname: req.body.fullname,
            login: req.body.login,
            role: req.body.role
        }

        const photo = await User.create(data)

        return res.json(photo)
    } catch(err) {
        return res.status(400).json({ error: `Error! The data is not valid; ${err}` })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const photo = await User.findByIdAndDelete(id)

        return res.json(photo)
    } catch(err) {
        return res.status(400).json({ error: `Error! The data is not valid; ${err}` })
    }
}