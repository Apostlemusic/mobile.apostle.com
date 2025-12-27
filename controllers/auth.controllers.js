import UserModel from '../model/User.js'

// Register a new user
export const register = async (req, res) => {
  try {
    const { email, password, name, phoneNumber } = req.body
    const exists = await UserModel.findOne({ email })
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' })

    const user = new UserModel({ email, password, name, phoneNumber })
    await user.save()

    const accessToken = user.getAccessToken()
    const refreshToken = user.getRefreshToken()

    res.status(201).json({ success: true, user: { id: user._id, email: user.email, name: user.name }, accessToken, refreshToken })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Register error', error: err.message })
  }
}

// Login existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const match = await user.matchPassword(password)
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const accessToken = user.getAccessToken()
    const refreshToken = user.getRefreshToken()
    res.status(200).json({ success: true, user: { id: user._id, email: user.email, name: user.name }, accessToken, refreshToken })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Login error', error: err.message })
  }
}

// Keep remaining handlers as simple stubs for now
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

export const verifyToken = async (req, res) => {
  res.status(501).json({ message: 'verifyToken handler not implemented' })
}

export const logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out (stub)' })
}

export default {
  register,
  login,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  verifyToken,
  logout,
}
