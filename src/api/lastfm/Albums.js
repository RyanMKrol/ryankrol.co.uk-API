import fetch from "node-fetch"
import fs from 'fs'

let rawdata = fs.readFileSync(__dirname + '/../../../credentials/lastfmConfig.json')
let config = JSON.parse(rawdata)

const username = config.username
const apiKey = config.apiKey

const API_ENDPOINT = `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&format=json&period=7day&user=${username}&api_key=${apiKey}`

async function fetchAlbums() {
  const rawAlbumData = await apiCall()
  const resultData = extractRelevantApiData(rawAlbumData)

  return resultData
}

function extractRelevantApiData(rawData) {
  const albums = rawData.topalbums.album
  const relevantdata = albums.map((album) => {
    const artist = album.artist.name
    const albumName = album.name
    const albumLink = album.url
    const thumbnail = album.image[album.image.length-1]['#text']

    if (artist && albumName && thumbnail)
      return {
        artist,
        albumName,
        albumLink,
        thumbnail,
      }
  }).filter((x) => typeof x !== 'undefined')

  return relevantdata
}

async function apiCall() {
  return fetch(API_ENDPOINT)
    .then((res) => {
      console.log('finished making a request, lets see what happens')
      return res.json()
    })
    .catch((err) => {
      console.log('have an error of some kind')
      console.error(err)
    })
}

export default fetchAlbums
