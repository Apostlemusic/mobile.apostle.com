import express from 'express'
import * as controllers from '../controllers/song.controllers.js'
import { uploadMiddleware } from '../controllers/song.controllers.js'

import { AuthenticateUser, AuthenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

//POST ROUTES
router.post('/newSong', AuthenticateAdmin, uploadMiddleware, controllers.newSong)
router.post('/updateSong', AuthenticateAdmin, uploadMiddleware, controllers.updateSong)
router.post('/deleteSongs', AuthenticateAdmin, controllers.deleteSongs)
router.post('/handleLike', AuthenticateUser, controllers.handleLike)

//router.post('/deleteAm', controllers.deleteAm)


//GET ROUTES
router.get('/getAllSongs', AuthenticateUser, controllers.getAllSongs)
router.get('/getLikedSongs', AuthenticateUser, controllers.getLikedSongs)
router.get('/getASongs/:id', AuthenticateUser, controllers.getASongs)
router.get('/getSongLyrics/:id', AuthenticateUser, controllers.getSongLyrics)
router.get('/getRecentPlays', AuthenticateUser, controllers.getRecentPlays)
router.get('/getQuickPicks', AuthenticateUser, controllers.getQuickPicks)
router.get('/getNewRelease', AuthenticateUser, controllers.getNewRelease)
router.get('/getRecommended', AuthenticateUser, controllers.getRecommended)
router.get('/getSongWithQuery/:query', AuthenticateUser, controllers.getSongWithQuery)




router.get('/getAdminAllSongs', AuthenticateAdmin, controllers.getAdminAllSongs)
router.get('/getAdminASongs/:id', AuthenticateAdmin, controllers.getAdminASongs)

router.get('/getSongByCategory/:category', AuthenticateUser, controllers.getSongByCategory)



//PUT ROUTES

export default router
