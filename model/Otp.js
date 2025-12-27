import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    code: {
        type: String
    },
    email: {
        type: String
    },
    userId: {
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 3600 //1Hour
    }
},
{ timestamps: true }
)

const OtpModel = mongoose.model('otp', OtpSchema)
export default OtpModel