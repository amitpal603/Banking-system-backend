import express from "express";
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transaction.route.js"

const app = express();
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(cookieParser());

// ! Routes

app.use("/api/auth" , authRouter)
app.use("/api/accounts" , accountRouter)
app.use("/api/transactions" , transactionRouter)
export default app