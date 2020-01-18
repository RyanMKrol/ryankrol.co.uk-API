// routes/index.js
import express from 'express'
import { fetchBooks } from './../api/GoogleBooks'

var router = express.Router()

/* GET home page. */
router.get('/', async (req, res, next) => {
  const books = await fetchBooks()
  res.send(books)
})

export default router
