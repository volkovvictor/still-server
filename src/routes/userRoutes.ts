import { Router } from "express";
import { getUsers, createUser, deleteUser } from "../controllers/usersController.js";

const router = Router()

router.get('/', getUsers)
router.post('/', createUser)
router.delete('/:id', deleteUser)

export default router