// routes/albums.js
import express from 'express'
import { fetchAlbums } from './../api/LastFM'
import { Cache } from './../cache'

const CACHE_TTL_MINUTES = 5
const albumCache = new Cache(fetchAlbums, CACHE_TTL_MINUTES)

const router = express.Router()

router.get('/', async (req, res, next) => {
  const albums = await albumCache.fetchData()
  res.send(albums)
})

export default router
