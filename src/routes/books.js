// routes/books.js
import express from 'express'
import { fetchBooks } from './../api/GoogleBooks'

var router = express.Router()

router.get('/', async (req, res, next) => {
  const books = await fetchBooks()
  res.send(books)
})

export default router
