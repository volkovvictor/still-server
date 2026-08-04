import { Request, Response } from "express";
import { Photoshoot } from "../models/Photoshoot.js";
import { IPhotoshootInput } from "../models/Photoshoot.js";
import { Photo, IPhotoOutput } from "../models/Photo.js";
import { cloudinary } from "../middlewares/fileUpload.js";

export const getAllPhotoshoots = async (req: Request, res: Response) => {
    try {
        const photoshoots = await Photoshoot.find()
        return res.status(200).json(photoshoots)
    } catch(err) {
        return res.status(500).json({ error: `Server Error; ${err}` })
    }
}

export const createPhotoshoot = async (req: Request, res: Response) => {
    try {
        const data = req.body as IPhotoshootInput
        const photoshoot = await Photoshoot.create(data)

        return res.json(photoshoot)
    } catch(err) {
        return res.status(400).json({ error: `Error! The data is not valid; ${err}` })
    }
}

export const updatePhotoshoot = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const photoshoot = await Photoshoot.findByIdAndUpdate(id, 
            { 
                ...req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        return res.json(photoshoot)
    } catch(err) {
        return res.status(404).json({ error: `Error! Photoshoot not found ${err}` })
    }
}

export const deletePhotoshoot = async (req: Request, res: Response) => {
    try {
        const { id: photoshootID } = req.params

        if (!photoshootID) {
            throw new Error("Id is undefined")
        } 

        const photosByPhotoshootId = await Photo.find({ photoshootID }) as IPhotoOutput[]

        for (const photo of photosByPhotoshootId) {
            if (photo.photoPublicId) {
                await cloudinary.uploader.destroy(photo.photoPublicId)
            }
        }

        await Photo.deleteMany({ photoshootID })

        const photoshoot = await Photoshoot.findByIdAndDelete(photoshootID)

        return res.json(photoshoot)
    } catch(err) {
        return res.status(404).json({ error: `Error! Photoshoot not found ${err}` })
    }
}