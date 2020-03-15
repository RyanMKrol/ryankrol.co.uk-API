// routes/albums.js
import express from 'express'
import { fetchAlbums } from './../api/LastFM'
import { Cache } from './../cache'

const albumCache = new Cache(fetchAlbums, 1)

const router = express.Router()

router.get('/', async (req, res, next) => {
  const albums = await albumCache.fetchData()
  res.send(albums)
})

export default router
