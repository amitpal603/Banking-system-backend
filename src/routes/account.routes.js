import {Router} from "express"
import { createAccount, getAccountBalance, getUserAccounts } from "../controllers/account.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

/**
 * @desc    create a new bank account for the authenticated user
 * @route   POST /api/accounts
 * @access  Private
 *
 */

router.post("/create" ,authMiddleware , createAccount)

/**
 * @desc    get all accounts for the authenticated user
 * @route   GET /api/accounts
 * @access  Private
 */

router.get("/get/accounts" , authMiddleware , getUserAccounts)

/**
 *  - get /api/accounts/balance/:accountId  - get balance for a specific account
 *  - get /api/accounts/transactions/:accountId - get transaction history for a specific account
 * 
 */
router.get("/balance/:accountId" , authMiddleware , getAccountBalance)
export default router