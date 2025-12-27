import ArtistModel from '../model/Artist.js'

export const uploadMiddleware = (req, res, next) => next()

export const createArtist = async (req, res) => {
	try {
		const a = new ArtistModel(req.body)
		await a.save()
		res.status(201).json({ success: true, artist: a })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error creating artist', error: err.message })
	}
}

export const updateArtist = async (req, res) => {
	try {
		const { artistId, ...rest } = req.body
		const a = await ArtistModel.findByIdAndUpdate(artistId, rest, { new: true })
		res.status(200).json({ success: true, artist: a })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error updating artist', error: err.message })
	}
}

export const deleteArtist = async (req, res) => {
	try {
		const { artistId } = req.body
		await ArtistModel.findByIdAndDelete(artistId)
		res.status(200).json({ success: true, message: 'Artist deleted' })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error deleting artist', error: err.message })
	}
}

export const followArtist = async (req, res) => {
	try {
		const { artistId, userId } = req.body
		const a = await ArtistModel.findById(artistId)
		if (!a) return res.status(404).json({ success: false, message: 'Artist not found' })
		a.followers = a.followers || []
		if (!a.followers.includes(userId)) a.followers.push(userId)
		else a.followers = a.followers.filter(f => f !== userId)
		await a.save()
		res.status(200).json({ success: true, followers: a.followers })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error toggling follow', error: err.message })
	}
}

export const likeArtist = async (req, res) => {
	try {
		const { artistId, userId } = req.body
		const a = await ArtistModel.findById(artistId)
		if (!a) return res.status(404).json({ success: false, message: 'Artist not found' })
		a.likes = a.likes || []
		if (!a.likes.includes(userId)) a.likes.push(userId)
		else a.likes = a.likes.filter(l => l !== userId)
		await a.save()
		res.status(200).json({ success: true, likes: a.likes })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error toggling like', error: err.message })
	}
}

export const getAllArtists = async (req, res) => {
	try {
		const artists = await ArtistModel.find()
		res.status(200).json({ success: true, artists })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching artists', error: err.message })
	}
}

export const getArtistById = async (req, res) => {
	try {
		const a = await ArtistModel.findById(req.params.artistId)
		if (!a) return res.status(404).json({ success: false, message: 'Artist not found' })
		res.status(200).json({ success: true, artist: a })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching artist', error: err.message })
	}
}

export const getMyArtists = async (req, res) => {
	res.status(501).json({ message: 'getMyArtists not implemented' })
}

export const getLikedArtists = async (req, res) => {
	res.status(501).json({ message: 'getLikedArtists not implemented' })
}

export const getFollowedArtists = async (req, res) => {
	res.status(501).json({ message: 'getFollowedArtists not implemented' })
}

export default {
	uploadMiddleware,
	createArtist,
	updateArtist,
	deleteArtist,
	followArtist,
	likeArtist,
	getAllArtists,
	getArtistById,
	getMyArtists,
	getLikedArtists,
	getFollowedArtists,
}
