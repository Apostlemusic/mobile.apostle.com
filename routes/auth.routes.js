import express from 'express'
import * as controllers from '../controllers/auth.controllers.js'

const router = express.Router()


//POST
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.post('/verifyOtp', controllers.verifyOtp)
router.post('/resendOtp', controllers.resendOtp)
router.post('/forgotPassword', controllers.forgotPassword)
router.post('/resetPassword', controllers.resetPassword)
router.post('/verifyToken', controllers.verifyToken)
router.post('/logout', controllers.logout)


//router.post('/deleteAll', controllers.deleteAll)


//PUT ROUTES

export default router
