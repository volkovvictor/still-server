import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv"

interface ICloudParams {
    folder: string,
    allowed_types: string[],
    transformation: {
        width: number,
        height: number,
        crop: string
    }
}

dotenv.config()

const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
const api_key = process.env.CLOUDINARY_API_KEY
const api_secret = process.env.CLOUDINARY_API_SECRET

if (!cloud_name || !api_key || !api_secret) {
    throw new Error("There is undefined params for the cloudinary")
}

cloudinary.config({cloud_name, api_key, api_secret})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'photos',
        allowed_types: ['jpeg', 'jpg', 'png', 'gif', 'webp'],
        transformation: {
            width: 1200,
            height: 800,
            crop: 'limit'
        }
    } as ICloudParams
})

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed_types = /jpeg|jpg|png|gif|webp/
    const extname = allowed_types.test(file.originalname.toLocaleLowerCase())
    const mimetype = allowed_types.test(file.mimetype)
    
    if (extname && mimetype) {
        cb(null, true)
    } else {
        cb(new Error("The type of the file does not pass"))
    }
}

export const fileUpload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})

export { cloudinary }