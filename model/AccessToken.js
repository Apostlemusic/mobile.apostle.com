import mongoose from "mongoose";

const SpotifyTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, 'Spotify Token is required.']
    }
})

const SpotifyTokenModel = mongoose.model('spotifyToken', SpotifyTokenSchema)
export default SpotifyTokenModel