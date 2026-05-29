import {Router} from "express"
import { authMiddleware, systemUserMiddleware } from "../middleware/auth.middleware.js"
import { createInitialTransactionFunds, createTransaction } from "../controllers/transaction.controller.js"

const  router = Router()

/**
 * @desc    create a new transaction between two accounts
 * @route   POST /api/transactions
 * @access  Private
 *
 *
 */
router.post("/" , authMiddleware , createTransaction)

/**
 * 
 */
router.post("/system/initial-funds" , systemUserMiddleware , createInitialTransactionFunds)

export default router