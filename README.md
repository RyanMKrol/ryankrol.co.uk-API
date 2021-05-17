# ryankrol.co.uk-API

The aim of this API is to provide any data needed on ryankrol.co.uk

## Albums

### Summary

Provides the list of albums I've been listening to over the last month, using the LastFM API.

### Endpoint

/api/listens

### Example Response

```
[
  {
    "artist": "Kaiser Chiefs",
    "albumName": "Employment",
    "albumLink": "https://www.last.fm/music/Kaiser+Chiefs/Employment",
    "thumbnail": "https://lastfm.freetls.fastly.net/i/u/300x300/245b232cde684c23b6531acf5086a0db.png",
    "playcount": "12"
  },
  {
    "artist": "Kanye West",
    "albumName": "Late Registration",
    "albumLink": "https://www.last.fm/music/Kanye+West/Late+Registration",
    "thumbnail": "https://lastfm.freetls.fastly.net/i/u/300x300/8116d69c9a334b33cbe0b1d5adc407cd.png",
    "playcount": "12"
  },
  ...
]
```

## Books

### Summary

Provides the books current found in my reading list, using the Google Books API.

### Endpoint

/api/books

### Example Response

```
[
  {
    "authors": [
      "Matt Haig"
    ],
    "bookId": "4mZ1XoSpR9UC",
    "images": {
      "smallThumbnail": "http://books.google.com/books/content?id=4mZ1XoSpR9UC&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
      "thumbnail": "http://books.google.com/books/content?id=4mZ1XoSpR9UC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    "isbn": "9780857868770",
    "series": "The Humans",
    "numberInSeries": 1,
    "title": "The Humans"
  },
  {
    "authors": [
      "Kurt Vonnegut"
    ],
    "bookId": "gMcab1F-IL4C",
    "images": {
      "smallThumbnail": "http://books.google.com/books/content?id=gMcab1F-IL4C&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
      "thumbnail": "http://books.google.com/books/content?id=gMcab1F-IL4C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"
    },
    "isbn": "9780099800200",
    "series": "Slaughterhouse 5",
    "numberInSeries": 1,
    "title": "Slaughterhouse 5"
  },
  ...
]
```

## Movies

### Summary

Provides the list of movies found in my library, using S3, and data updated from my [film storage updated tool](https://github.com/RyanMKrol/FilmStorageUpdater).

### Endpoint

/api/movies

### Example Response

```
[
  {
    "Title": "About a Boy",
    "Year": "2002",
    "Rated": "PG-13",
    "Released": "17 May 2002",
    "Runtime": "101 min",
    "Genre": "Comedy, Drama, Romance",
    "Director": "Chris Weitz, Paul Weitz",
    "Writer": "Nick Hornby (novel), Peter Hedges (screenplay), Chris Weitz (screenplay), Paul Weitz (screenplay)",
    "Actors": "Hugh Grant, Nicholas Hoult, Sharon Small, Madison Cook",
    "Plot": "A cynical, immature young man is taught how to act like a grown-up by a little boy.",
    "Language": "English",
    "Country": "UK, USA, France, Germany",
    "Awards": "Nominated for 1 Oscar. Another 11 wins & 29 nominations.",
    "Poster": "https://m.media-amazon.com/images/M/MV5BMTQ2Mzg4MDAzNV5BMl5BanBnXkFtZTgwMjcxNTYxMTE@._V1_SX300.jpg",
    "Ratings": [
      {
        "Source": "Internet Movie Database",
        "Value": "7.0/10"
      },
      {
        "Source": "Rotten Tomatoes",
        "Value": "93%"
      },
      {
        "Source": "Metacritic",
        "Value": "75/100"
      }
    ],
    "Metascore": "75",
    "imdbRating": "7.0",
    "imdbVotes": "166,585",
    "imdbID": "tt0276751",
    "Type": "movie",
    "DVD": "14 Jan 2003",
    "BoxOffice": "$40,566,655",
    "Production": "Universal Pictures",
    "Website": "N/A",
    "Response": "True"
  },
  ...
]
```

## Ratings

### Summary

Provides the data behind ratings I've been giving to movies and albums.

### Endpoint

/api/ratings/album

### Example Response

```
[
  {
    "highlights": "Selah, Follow God",
    "artist": "Kanye West",
    "mood": "Vibin",
    "date": "16-05-2021",
    "rating": 71,
    "title": "JESUS IS KING"
  },
  {
    "highlights": "Warm, Fly on the Wall, Husky",
    "artist": "Joey Pecoraro",
    "mood": "Zen",
    "date": "15-03-21",
    "rating": 78,
    "title": "Little Pear"
  },
  ...
]
```

### Endpoint

/api/ratings/movie

### Example Response

```
[
  {
    "sound": 5,
    "blind": 15,
    "craftsmanship": 10,
    "gist": "A killer clown exists",
    "characters": 5,
    "story": 15,
    "title": "Killjoy"
  },
  {
    "sound": 75,
    "blind": 30,
    "craftsmanship": 75,
    "gist": "A strange man goes hunting for a jaguar, or a shark",
    "characters": 40,
    "story": 55,
    "title": "The Life Aquatic with Steve Zissou"
  },
  ...
]
```

[![Build Status](https://travis-ci.org/RyanMKrol/ryankrol.co.uk-api.svg?branch=master)](https://travis-ci.org/RyanMKrol/ryankrol.co.uk-api)
