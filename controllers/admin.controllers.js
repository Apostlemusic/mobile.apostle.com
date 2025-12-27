import AdminModel from '../model/Admin.js'

export const register = async (req, res) => {
	try {
		const { email, password, name, phoneNumber } = req.body
		const exists = await AdminModel.findOne({ email })
		if (exists) return res.status(400).json({ success: false, message: 'Email already exists' })

		const admin = new AdminModel({ email, password, name, phoneNumber })
		await admin.save()

		const accessToken = admin.getAccessToken()
		const refreshToken = admin.getRefreshToken()
		res.status(201).json({ success: true, admin: { id: admin._id, email: admin.email, name: admin.name }, accessToken, refreshToken })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Admin register error', error: err.message })
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body
		const admin = await AdminModel.findOne({ email })
		if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials' })

		const match = await admin.matchPassword(password)
		if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

		const accessToken = admin.getAccessToken()
		const refreshToken = admin.getRefreshToken()
		res.status(200).json({ success: true, admin: { id: admin._id, email: admin.email, name: admin.name }, accessToken, refreshToken })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Admin login error', error: err.message })
	}
}

export const verifyOtp = async (req, res) => {
	res.status(501).json({ message: 'verifyOtp handler not implemented' })
}

export const resendOtp = async (req, res) => {
	res.status(501).json({ message: 'resendOtp handler not implemented' })
}

export const forgotPassword = async (req, res) => {
	res.status(501).json({ message: 'forgotPassword handler not implemented' })
}

export const resetPassword = async (req, res) => {
	res.status(501).json({ message: 'resetPassword handler not implemented' })
}

export const logout = async (req, res) => {
	res.status(200).json({ success: true, message: 'Admin logged out (stub)' })
}

export default {
	register,
	login,
	verifyOtp,
	resendOtp,
	forgotPassword,
	resetPassword,
	logout,
}
