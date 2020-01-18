import fetch from "node-fetch"
import fs from 'fs'

function fetchConfig(location) {
  let rawConfig = fs.readFileSync(location)
  let config = JSON.parse(rawConfig)

  return config
}

async function apiCall(endpoint) {
  return fetch(endpoint)
    .then((res) => {
      return res.json()
    })
    .catch((err) => {
      console.error(err)
    })
}

export {
  apiCall,
  fetchConfig
}
