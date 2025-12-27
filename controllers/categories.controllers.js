import CategoryModel from '../model/Categories.js'
import GenreModel from '../model/Genre.js'

export const uploadMiddleware = (req, res, next) => next()

export const createCategory = async (req, res) => {
	try {
		const cat = new CategoryModel(req.body)
		await cat.save()
		res.status(201).json({ success: true, category: cat })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error creating category', error: err.message })
	}
}

export const updateCategory = async (req, res) => {
	try {
		const { id, ...rest } = req.body
		const cat = await CategoryModel.findByIdAndUpdate(id, rest, { new: true })
		res.status(200).json({ success: true, category: cat })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error updating category', error: err.message })
	}
}

export const deleteCategory = async (req, res) => {
	try {
		const { id } = req.body
		await CategoryModel.findByIdAndDelete(id)
		res.status(200).json({ success: true, message: 'Category deleted' })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error deleting category', error: err.message })
	}
}

export const createGenre = async (req, res) => {
	try {
		const g = new GenreModel(req.body)
		await g.save()
		res.status(201).json({ success: true, genre: g })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error creating genre', error: err.message })
	}
}

export const updateGenre = async (req, res) => {
	try {
		const { id, ...rest } = req.body
		const g = await GenreModel.findByIdAndUpdate(id, rest, { new: true })
		res.status(200).json({ success: true, genre: g })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error updating genre', error: err.message })
	}
}

export const deleteGenre = async (req, res) => {
	try {
		const { id } = req.body
		await GenreModel.findByIdAndDelete(id)
		res.status(200).json({ success: true, message: 'Genre deleted' })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error deleting genre', error: err.message })
	}
}

export const getAllCategory = async (req, res) => {
	try {
		const cats = await CategoryModel.find()
		res.status(200).json({ success: true, categories: cats })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching categories', error: err.message })
	}
}

export const getCategory = async (req, res) => {
	try {
		const cat = await CategoryModel.findOne({ slug: req.params.categorySlug })
		if (!cat) return res.status(404).json({ success: false, message: 'Category not found' })
		res.status(200).json({ success: true, category: cat })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching category', error: err.message })
	}
}

export const getAllGenre = async (req, res) => {
	try {
		const genres = await GenreModel.find()
		res.status(200).json({ success: true, genres })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching genres', error: err.message })
	}
}

export const getGenre = async (req, res) => {
	try {
		const g = await GenreModel.findOne({ slug: req.params.genreSlug })
		if (!g) return res.status(404).json({ success: false, message: 'Genre not found' })
		res.status(200).json({ success: true, genre: g })
	} catch (err) {
		res.status(500).json({ success: false, message: 'Error fetching genre', error: err.message })
	}
}

export default {
	uploadMiddleware,
	createCategory,
	updateCategory,
	deleteCategory,
	createGenre,
	updateGenre,
	deleteGenre,
	getAllCategory,
	getCategory,
	getAllGenre,
	getGenre,
}
