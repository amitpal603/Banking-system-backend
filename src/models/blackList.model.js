import {Schema , model} from "mongoose"

const blacklistSchema = new Schema({
    token : {
        type : String,
        required :[true , "Token is required"],
        unique : [true , "Token must be unique"]
    }
} , {timestamps : true})

blacklistSchema.index({ createdAt : 1} , 
    {expireAfterSeconds : 60 * 60 * 24 * 3})// expire after 3 days

    const blacklistModel = model("Blacklist" , blacklistSchema)

    export default blacklistModel