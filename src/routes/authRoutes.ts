import { Router } from "express";
import { login, register, authorization } from "../controllers/authController.js";
import authToken from "../middlewares/authToken.js";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/auth', authToken, authorization)

export default router