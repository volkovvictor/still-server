import { Router } from "express";
import { login, register, authorization, refresh, logout } from "../controllers/authController.js";
import authToken from "../middlewares/authToken.js";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/auth', authToken, authorization)
router.post('/logout', logout)

export default router