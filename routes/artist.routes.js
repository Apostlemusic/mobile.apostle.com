

import express from 'express'
import * as controllers from '../controllers/artist.controllers.js'
import { uploadMiddleware } from '../controllers/artist.controllers.js'

import { AuthenticateUser, AuthenticateAdmin } from '../middleware/auth.js'

const router = express.Router()

//POST ROUTES
router.post('/createArtist', AuthenticateAdmin, uploadMiddleware, controllers.createArtist)
router.post('/updateArtist/:artistId', AuthenticateAdmin, uploadMiddleware, controllers.updateArtist)
router.post('/deleteArtist', AuthenticateAdmin, uploadMiddleware, controllers.deleteArtist)
router.post('/followArtist', AuthenticateUser, uploadMiddleware, controllers.followArtist)
router.post('/likeArtist', AuthenticateUser, uploadMiddleware, controllers.likeArtist)


//GET ROUTES

router.get('/getAllArtists', AuthenticateUser, controllers.getAllArtists)
router.get('/getArtistById/:artistId', controllers.getArtistById)
router.get('/getMyArtists', AuthenticateAdmin, controllers.getMyArtists)
router.get('/getLikedArtists', AuthenticateUser, controllers.getLikedArtists)
router.get('/getFollowedArtists', AuthenticateUser, controllers.getFollowedArtists)

//PUT ROUTES

export default router
