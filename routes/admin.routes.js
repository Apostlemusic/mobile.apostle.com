import express from 'express'
import * as controllers from '../controllers/admin.controllers.js'

const router = express.Router()


//POST
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.post('/verifyOtp', controllers.verifyOtp)
router.post('/resendOtp', controllers.resendOtp)
router.post('/forgotPassword', controllers.forgotPassword)
router.post('/resetPassword', controllers.resetPassword)
router.post('/logout', controllers.logout)



//PUT ROUTES

export default router
