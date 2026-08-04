import { Request, Response } from "express";
import { Photo } from "../models/Photo.js";
import { User } from "../models/User.js";
import { Photoshoot } from "../models/Photoshoot.js";
import { IPhotoInput, PhotoType } from "../models/Photo.js";

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

export const getPhotosByType = async (req: Request, res: Response) => {
    try {
        const type = req.params.type as PhotoType
        const validTypes: PhotoType[] = ['preview', 'user', 'portfolio']
        if (!validTypes.includes(type)) {
            throw new Error("Type is not valid")
        }
        const photos = await Photo.find({ type }).sort({ position: 1 })
        return res.status(200).json(photos)
    } catch(err) {
        return res.status(404).json({ error: `Error: ${err}` })
    }
}

export const getPhotoById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const photo = await Photo.findById(id)

        if (!photo) {
            throw new Error("Photo not found")
        } 

        return res.status(200).json(photo)
    } catch(err) {
        return res.status(404).json({ error: `Error: ${err}` })
    }
}

export const getPhotosByUserId = async (req: Request, res: Response) => {
    try {
        const userID = req.params.userID as string // edit
        const user = await User.findById(userID)

        console.log('user', user)

        if (!user) {
            throw new Error('User not found')
        }

        const photos = await Photo.find({ userID }).sort({ position: 1 })

        return res.status(200).json(photos)
    } catch(err) {
        return res.status(404).json({ error: `Error: ${err}` })
    }
}

export const getPhotosByPhotoshootId = async (req: Request, res: Response) => {
    try {
        const photoshootID = req.params.photoshootID as string // edit
        const photoshoot = await Photoshoot.findById(photoshootID)

        if (!photoshoot) {
            throw new Error('Photoshoot not found')
        }

        const photos = await Photo.find({ photoshootID }).sort({ position: 1 })

        return res.status(200).json(photos)
    } catch(err) {
        return res.status(404).json({ error: `Error: ${err}` })
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
            isPurchased: req.body.isPurchased,
            isAddedToCart: req.body.isAddedToCart
        } : {}

        const portfolioPhotoData: portfolioPhotoType = req.body.type === 'portfolio' ? {
            photoshootID: req.body.photoshootID
        } : {}

        const data: IPhotoInput = {
            src: req.file.path,
            position: req.body.position,
            photoPublicId: req.file.filename,
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

export const updatePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const photo = await Photo.findByIdAndUpdate(id, 
            { 
                ...req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        return res.json(photo)
    } catch(err) {
        return res.status(404).json({ error: `Error! Photo not found ${err}` })
    }
}

export const deletePhoto = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const photo = await Photo.findByIdAndDelete(id)

        return res.json(photo)
    } catch(err) {
        return res.status(404).json({ error: `Error! Photo not found ${err}` })
    }
}