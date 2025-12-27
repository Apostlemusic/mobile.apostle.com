import PlayListModel from '../model/PlayList.js'

export const newPlayList = async (req, res) => {
	try {
		const { name, userId } = req.body
		const pl = new PlayListModel({ name, userId, tracksId: [] })
		await pl.save()
		res.status(201).json({ success: true, playList: pl })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error creating playlist', error: err.message })
	}
}

export const addToPlayList = async (req, res) => {
	try {
		const { playlistId, trackId } = req.body
		const pl = await PlayListModel.findById(playlistId)
		if (!pl) return res.status(404).json({ success: false, message: 'Playlist not found' })
		pl.tracksId = pl.tracksId || []
		if (!pl.tracksId.includes(trackId)) pl.tracksId.push(trackId)
		await pl.save()
		res.status(200).json({ success: true, playList: pl })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error adding to playlist', error: err.message })
	}
}

export const deletePlayList = async (req, res) => {
	try {
		const { playlistId } = req.body
		await PlayListModel.findByIdAndDelete(playlistId)
		res.status(200).json({ success: true, message: 'Playlist deleted' })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error deleting playlist', error: err.message })
	}
}

export const removeTrackFromPlayList = async (req, res) => {
	try {
		const { playlistId, trackId } = req.body
		const pl = await PlayListModel.findById(playlistId)
		if (!pl) return res.status(404).json({ success: false, message: 'Playlist not found' })
		pl.tracksId = (pl.tracksId || []).filter(t => t !== trackId)
		await pl.save()
		res.status(200).json({ success: true, playList: pl })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error removing track', error: err.message })
	}
}

export const getUserAllPlayList = async (req, res) => {
	try {
		const userId = req.query.userId
		const pls = await PlayListModel.find({ userId })
		res.status(200).json({ success: true, playLists: pls })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching playlists', error: err.message })
	}
}

export const getUserPlayList = async (req, res) => {
	try {
		const pl = await PlayListModel.findById(req.params._id)
		if (!pl) return res.status(404).json({ success: false, message: 'Playlist not found' })
		res.status(200).json({ success: true, playList: pl })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching playlist', error: err.message })
	}
}

export default {
	newPlayList,
	addToPlayList,
	deletePlayList,
	removeTrackFromPlayList,
	getUserAllPlayList,
	getUserPlayList,
}
