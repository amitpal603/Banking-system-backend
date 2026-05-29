import {Schema , model} from "mongoose"

const transactionSchema = new Schema({
    fromAccount : {
        type : Schema.Types.ObjectId,
        ref : "Account",
        required : [true , "From account is required"],
        index : true
    },
    toAccount : {
        type : Schema.Types.ObjectId,
        ref : "Account",
        required : [true , "From account is required"],
        index : true
    },
    status : {
        type : String,
        enum : {
            values : ["PENDING" , "COMPLETED" , "FAILED" , "REVERSED"],
            message : "Status must be either pending, completed or failed"
        },
        default : "PENDING"
    },
    amount : {
        type : Number,
        required : [true , "Amount is required"],
        min : [0 , "Amount must be greater than 0"]
    },
    idempotencyKey : {
        type : String,
        required : [true , "Idempotency key is required"],
        unique : true,
        index : true
    }
} , {timestamps: true })

const  transactionModel = model("Transaction" , transactionSchema)

export default transactionModel