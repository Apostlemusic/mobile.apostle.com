import express from 'express'
import * as controllers from '../controllers/categories.controllers.js'
import { AuthenticateAdmin, AuthenticateUser } from '../middleware/auth.js'
import { uploadMiddleware } from '../controllers/categories.controllers.js'

const router = express.Router()

//POST ROUTES
router.post('/createCategory', AuthenticateAdmin, uploadMiddleware, controllers.createCategory)
router.post('/updateCategory', AuthenticateAdmin, uploadMiddleware, controllers.updateCategory)
router.post('/deleteCategory', AuthenticateAdmin, controllers.deleteCategory)

//POST GENRE
router.post('/createGenre', AuthenticateAdmin, uploadMiddleware, controllers.createGenre)
router.post('/updateGenre', AuthenticateAdmin, uploadMiddleware, controllers.updateGenre)
router.post('/deleteGenre', AuthenticateAdmin, controllers.deleteGenre)


//GET ROUTES
router.get('/getAllCategory', controllers.getAllCategory)
router.get('/getCategory/:categorySlug', controllers.getCategory)

//GET GENRE
router.get('/getAllGenre', controllers.getAllGenre)
router.get('/getGenre/:genreSlug', controllers.getGenre)

//PUT ROUTES

export default router
