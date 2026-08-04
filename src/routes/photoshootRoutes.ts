import { Router } from "express";
import {
    getAllPhotoshoots,
    createPhotoshoot,
    deletePhotoshoot,
    updatePhotoshoot
} from "../controllers/photoshootController.js";

const router = Router()

router.get('/', getAllPhotoshoots)
router.post('/', createPhotoshoot)
router.put('/:id', updatePhotoshoot)
router.delete('/:id', deletePhotoshoot)

export default router