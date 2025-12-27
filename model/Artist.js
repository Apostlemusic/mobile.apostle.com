import mongoose from "mongoose";

const ArtistSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    artistId: {
        type: String
    },
    type: {
        type: String,
        enum: ["artist", "band", "church", "organization"]
    },
    name: {
        type: String
    },
    profileImg: {
        type: String
    },
    about: {
        type: String
    },
    description: {
        type: String
    },
    followers: {
        type: Array,
        default: []
    },
    likes: {
        type: Array,
        default: []
    }
},
{ timestamps: true})

const ArtistModel = mongoose.model('topAirtist', ArtistSchema)
export default ArtistModel