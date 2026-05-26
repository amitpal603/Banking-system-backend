import {Router} from "express"
import { userLogin, userRegister } from "../controllers/auth.controller.js";

const router = Router();
/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post("/register" , userRegister)

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */

router.post("/login" , userLogin)

export default router