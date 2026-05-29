import {Router} from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import { createTransaction } from "../controllers/transaction.controller.js"

const  router = Router()

/**
 * @desc    create a new transaction between two accounts
 * @route   POST /api/transactions
 * @access  Private
 *
 *
 */
router.post("/" , authMiddleware , createTransaction)

export default router