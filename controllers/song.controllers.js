import SongModel from '../model/Song.js'

export const uploadMiddleware = (req, res, next) => next()

export const newSong = async (req, res) => {
	try {
		const song = new SongModel(req.body)
		await song.save()
		res.status(201).json({ success: true, song })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error creating song', error: err.message })
	}
}

export const updateSong = async (req, res) => {
	try {
		const { id, ...rest } = req.body
		const song = await SongModel.findByIdAndUpdate(id, rest, { new: true })
		res.status(200).json({ success: true, song })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error updating song', error: err.message })
	}
}

export const deleteSongs = async (req, res) => {
	try {
		const { ids } = req.body // expect { ids: [id1, id2] }
		if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: 'ids array required' })
		await SongModel.deleteMany({ _id: { $in: ids } })
		res.status(200).json({ success: true, message: 'Songs deleted' })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error deleting songs', error: err.message })
	}
}

export const handleLike = async (req, res) => {
	try {
		const { songId, userId } = req.body
		const song = await SongModel.findById(songId)
		if (!song) return res.status(404).json({ success: false, message: 'Song not found' })
		song.likes = song.likes || []
		const idx = song.likes.indexOf(userId)
		if (idx === -1) song.likes.push(userId)
		else song.likes.splice(idx, 1)
		await song.save()
		res.status(200).json({ success: true, likes: song.likes })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error toggling like', error: err.message })
	}
}

export const getAllSongs = async (req, res) => {
	try {
		const songs = await SongModel.find()
		res.status(200).json({ success: true, songs })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching songs', error: err.message })
	}
}

export const getLikedSongs = async (req, res) => {
	try {
		const userId = req.query.userId
		const songs = await SongModel.find({ likes: userId })
		res.status(200).json({ success: true, songs })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching liked songs', error: err.message })
	}
}

export const getASongs = async (req, res) => {
	try {
		const song = await SongModel.findById(req.params.id)
		if (!song) return res.status(404).json({ success: false, message: 'Song not found' })
		res.status(200).json({ success: true, song })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching song', error: err.message })
	}
}

export const getSongLyrics = async (req, res) => {
	try {
		const song = await SongModel.findById(req.params.id)
		if (!song) return res.status(404).json({ success: false, message: 'Song not found' })
		res.status(200).json({ success: true, lyrics: song.lyrics })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching lyrics', error: err.message })
	}
}

export const getRecentPlays = async (req, res) => {
	res.status(501).json({ message: 'getRecentPlays not implemented' })
}

export const getQuickPicks = async (req, res) => {
	res.status(501).json({ message: 'getQuickPicks not implemented' })
}

export const getNewRelease = async (req, res) => {
	res.status(501).json({ message: 'getNewRelease not implemented' })
}

export const getRecommended = async (req, res) => {
	res.status(501).json({ message: 'getRecommended not implemented' })
}

export const getSongWithQuery = async (req, res) => {
	try {
		const { query } = req.params
		const songs = await SongModel.find({ $text: { $search: query } })
		res.status(200).json({ success: true, songs })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error searching songs', error: err.message })
	}
}

export const getAdminAllSongs = getAllSongs
export const getAdminASongs = getASongs

export const getSongByCategory = async (req, res) => {
	try {
		const { category } = req.params
		const songs = await SongModel.find({ category: { $in: [category] } })
		res.status(200).json({ success: true, songs })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching songs by category', error: err.message })
	}
}

export default {
	uploadMiddleware,
	newSong,
	updateSong,
	deleteSongs,
	handleLike,
	getAllSongs,
	getLikedSongs,
	getASongs,
	getSongLyrics,
	getRecentPlays,
	getQuickPicks,
	getNewRelease,
	getRecommended,
	getSongWithQuery,
	getAdminAllSongs,
	getAdminASongs,
	getSongByCategory,
}
