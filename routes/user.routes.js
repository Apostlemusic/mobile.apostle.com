import express from 'express'
import * as controllers from '../controllers/user.controller.js'
import { AuthenticateUser } from '../middleware/auth.js'

const router = express.Router()


//GET ROUTES
router.get('/getUsers', controllers.getUsers)
router.get('/getUser/:id', AuthenticateUser, controllers.getUser)


//PUT ROUTES

export default router
