import express from 'express'
import * as controllers from '../controllers/playList.controllers.js'
import { AuthenticateUser } from '../middleware/auth.js'

const router = express.Router()

//POST ROUTES
router.post('/newPlayList', AuthenticateUser, controllers.newPlayList)
router.post('/addToPlayList', AuthenticateUser, controllers.addToPlayList)
router.post('/deletePlayList', AuthenticateUser, controllers.deletePlayList)
router.post('/removeTrackFromPlayList', AuthenticateUser, controllers.removeTrackFromPlayList)

//GET ROUTES
router.get('/getUserAllPlayList', AuthenticateUser, controllers.getUserAllPlayList)
router.get('/getUserPlayList/:_id', AuthenticateUser, controllers.getUserPlayList)

//PUT ROUTES

export default router
