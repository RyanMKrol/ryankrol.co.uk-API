// routes/index.js
import express from 'express'
import { fetchAlbums } from './../api/LastFM'

var router = express.Router()

/* GET home page. */
router.get('/', async (req, res, next) => {
  const albums = await fetchAlbums()
  res.send(albums)
})

export default router
