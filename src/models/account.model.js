import {Schema , model} from "mongoose"

const accountSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true , "User reference is required"],
        index : true
    },
    status : {
        type : String,
        enum : {
            values : ["ACTIVE" , "FROZEN" , "CLOSED"],
            message : "Status must be either ACTIVE, FROZEN, or CLOSED",
           
        },
        default : "ACTIVE"
    },
    currency : {
        type : String,
        required : [true , "Currency is required"],
        default : "INR"
    }
} , {timestamps : true})

 accountSchema.index({user : 1 ,status : 1})

const Account = model("Account" , accountSchema)

export default Account