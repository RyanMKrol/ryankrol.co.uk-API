import fetch from "node-fetch"

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
  apiCall
}
