import { Router } from "express";
import { createPhoto, getAllPhotos } from "../controllers/previewController.js";
import { fileUpload } from "../middlewares/fileUpload.js";

const router = Router()

router.get('/', getAllPhotos)
router.post('/', fileUpload.single('src'), createPhoto)

export default router