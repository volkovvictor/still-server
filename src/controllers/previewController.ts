import { Request, Response } from "express";
import { Photo } from "../models/Photo.js";
import { IPhotoInput } from "../models/Photo.js";

type userPhotoType = Pick<IPhotoInput, 'userID' | 'isLiked' | 'isPurchased' | 'isAddedToCart'>
type portfolioPhotoType = Pick<IPhotoInput, 'photoshootID'>

export const getAllPhotos = async (req: Request, res: Response) => {
    try {
        const photos = await Photo.find()
        return res.status(200).json(photos)
    } catch(err) {
        return res.status(500).json({ error: `Server Error; ${err}` })
    }
}

export const createPhoto = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            throw new Error("File is not correct")
        }

        const userPhotoData: userPhotoType = req.body.type === 'user' ? {
            userID: req.body.userID,
            isLiked: req.body.isLiked,
            isPurchased: req.body.isLiked,
            isAddedToCart: req.body.isAddedToCart
        } : {}

        const portfolioPhotoData: portfolioPhotoType = req.body.type === 'portfolio' ? {
            photoshootID: req.body.photoschootID
        } : {}

        const data: IPhotoInput = {
            src: req.file.path,
            position: req.body.position,
            type: req.body.type,
            ...userPhotoData,
            ...portfolioPhotoData
        }

        const photo = await Photo.create(data)

        return res.json(photo)
    } catch(err) {
        return res.status(400).json({ error: `Error! The data is not valid; ${err}` })
    }
}