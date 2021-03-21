// routes/ratings.js
import express from 'express'
import fs from 'fs'
import date from 'date-and-time'
import { writeRatings } from './../api/Dynamo'

let rawdata = fs.readFileSync(__dirname + '/../../credentials/ryankrolRatingsCredentials.json')
let ratingsCredentials = JSON.parse(rawdata)

const router = express.Router()

function checkPassword(password) {
  return password === ratingsCredentials.password
}

// creation middleware
router.post('/*', async (req, res, next) => {
  if (!checkPassword(req.body.password)) {
    res.send({ message: 'Incorrect Password' })
  } else {
    // remove a password from potentially being stored
    delete req.body.password

    // add the current date to the storage payload
    req.body.date = date.format(new Date(), 'DD-MM-YYYY')

    // handover to the specific handler
    next()
  }
})

// specific routes

router.post('/movie', async (req, res, next) => {
  const callback = () => {
    res.send({ message: 'Movie Write Complete!' })
  }
  writeRatings('MovieRatings', req.body, callback)
})

router.post('/album', async (req, res, next) => {
  const callback = () => {
    res.send({ message: 'Album Write Complete!' })
  }
  writeRatings('AlbumRatings', req.body, callback)
})

export default router
