// routes/index.js
import express from 'express'
var router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Youre on the albums page')
})

export default router
