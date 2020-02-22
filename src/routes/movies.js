// routes/movies.js
import express from 'express'
import { fetchMovies } from './../api/S3'

var router = express.Router()

router.get('/', async (req, res, next) => {
  const movies = await fetchMovies()
  res.send(movies)
})

export default router
