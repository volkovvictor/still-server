import { Router } from "express";
import {
    getAllPhotoshoots,
    createPhotoshoot,
    deletePhotoshoot,
    updatePhotoshoot
} from "../controllers/photoshootController.js";

import { fileUpload } from "../middlewares/fileUpload.js";

const router = Router()

router.get('/', getAllPhotoshoots)
router.post('/', fileUpload.single("src"), createPhotoshoot)
router.put('/:id', updatePhotoshoot)
router.delete('/:id', deletePhotoshoot)

export default router