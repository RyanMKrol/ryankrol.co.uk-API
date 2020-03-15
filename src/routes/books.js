// routes/books.js
import express from 'express'
import { fetchBooks } from './../api/GoogleBooks'
import { Cache } from './../cache'

const booksCache = new Cache(fetchBooks, 1)

const router = express.Router()

router.get('/', async (req, res, next) => {
  const books = await booksCache.fetchData()
  res.send(books)
})

export default router
