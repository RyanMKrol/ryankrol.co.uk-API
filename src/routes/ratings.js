// routes/ratings.js
import express from 'express'
import fs from 'fs'
import { writeRatings } from './../api/Dynamo'

let rawdata = fs.readFileSync(__dirname + '/../../credentials/ryankrolRatingsCredentials.json')
let ratingsCredentials = JSON.parse(rawdata)

const router = express.Router()

router.post(
  '/',
  async (req, res, next) => {
    if (!checkPassword(req.body.password)) {
      res.send({ message: 'Incorrect Password' })
    } else {
      delete req.body.password
      next()
    }
  },
  async (req, res, next) => {
    const callback = () => {
      res.send({ message: 'Write Complete!' })
    }
    writeRatings(req.body, callback)
  }
)

function checkPassword(password) {
  return password === ratingsCredentials.password
}

export default router
