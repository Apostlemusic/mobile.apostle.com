import mongoose from "mongoose";

const PlayListSchema = new mongoose.Schema({
    name: {
        type: String
    },
    userId: {
        type: String
    },
    tracksId: {
        type: Array
    }
},
{ timestamps: true}
)

const PlayListModel = mongoose.model('playList', PlayListSchema)
export default PlayListModel