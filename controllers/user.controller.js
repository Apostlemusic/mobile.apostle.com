import UserModel from '../model/User.js'

export const getUsers = async (req, res) => {
	try {
		const users = await UserModel.find().select('-password')
		res.status(200).json({ success: true, users })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching users', error: err.message })
	}
}

export const getUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.id).select('-password')
		if (!user) return res.status(404).json({ success: false, message: 'User not found' })
		res.status(200).json({ success: true, user })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching user', error: err.message })
	}
}

export default {
	getUsers,
	getUser,
}
