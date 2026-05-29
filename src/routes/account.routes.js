import {Router} from "express"
import { createAccount } from "../controllers/account.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

/**
 * @desc    create a new bank account for the authenticated user
 * @route   POST /api/accounts
 * @access  Private
 *
 */

router.post("/create" ,authMiddleware , createAccount)

export default router