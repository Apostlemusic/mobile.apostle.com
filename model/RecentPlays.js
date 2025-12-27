import mongoose from "mongoose";

const RecentPlaysSchema = new mongoose.Schema({
    userId: {
        type: String,
        //required: [ true, 'User Id is required']
    },
    recentPlays: {
        type: Array
    }
},
{ timestamps: true}
)

const RecentPlaysModel = mongoose.model('recentplay', RecentPlaysSchema)
export default RecentPlaysModel