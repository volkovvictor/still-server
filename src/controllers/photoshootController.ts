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

        if (!req.file) {
            throw new Error("File is not correct")
        }

        const { width, height } = await cloudinary.api.resource(req.file.filename)
        const size = height > width ? 2 : 1

        const data: IPhotoshootInput = {
            previewSrc: req.file.path,
            position: req.body.position,
            date: req.body.date || new Date(),
            previewPhotoPublicId: req.file.filename,
            userID: req.body.userID,
            width,
            height,
            size,
        }
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

        const photoshoot = await Photoshoot.findById(photoshootID)

        if (!photoshoot) {
            throw new Error("Photoshoot not found")
        }

        const photosByPhotoshootId = await Photo.find({ photoshootID }) as IPhotoOutput[]

        for (const photo of photosByPhotoshootId) {
            if (photo.photoPublicId) {
                await cloudinary.uploader.destroy(photo.photoPublicId)
            }
        }

        await Photo.deleteMany({ photoshootID })

        await cloudinary.uploader.destroy(photoshoot.previewPhotoPublicId)
        await Photoshoot.findByIdAndDelete(photoshootID)

        return res.json(photoshoot)
    } catch(err) {
        return res.status(404).json({ error: `Error! ${err}` })
    }
}