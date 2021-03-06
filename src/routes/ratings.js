// routes/ratings.js
import express from 'express'
import fs from 'fs'

let rawdata = fs.readFileSync(__dirname + '/../../credentials/ryankrolRatingsCredentials.json')
let ratingsCredentials = JSON.parse(rawdata)

const router = express.Router()

router.post('/', async (req, res, next) => {
  const message = checkPassword(req.body.password) ? 'Pass!' : 'Fail!'
  res.send({
    message
  })
})

function checkPassword(password) {
  return password === ratingsCredentials.password
}

export default router
