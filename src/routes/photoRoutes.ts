import { Router } from "express";
import { 
    createPhoto,
    getAllPhotos,
    getPhotosByType,
    getPhotoById,
    getPhotosByUserId,
    getPhotosByPhotoshootId,
    updatePhoto,
    deletePhoto
} from "../controllers/photosController.js";
import { fileUpload } from "../middlewares/fileUpload.js";

const router = Router()

router.get('/', getAllPhotos)
router.post('/', fileUpload.single('src'), createPhoto)
router.get('/type/:type', getPhotosByType)
router.get('/:id', getPhotoById)
router.get('/user/:userID/photos', getPhotosByUserId)
router.get('/photoshoot/:photoshootID/photos', getPhotosByPhotoshootId)
router.put('/:id', updatePhoto)
router.delete('/:id', deletePhoto)

export default router