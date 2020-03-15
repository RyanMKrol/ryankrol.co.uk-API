// routes/movies.js
import express from 'express'
import { fetchMovies } from './../api/S3'
import { Cache } from './../cache'

const moviesCache = new Cache(fetchMovies, 1)

const router = express.Router()

router.get('/', async (req, res, next) => {
  const movies = await moviesCache.fetchData()
  res.send(movies)
})

export default router
