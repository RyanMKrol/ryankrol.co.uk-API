// routes/ratings.js
import express from "express";
import fs from "fs";
import date from "date-and-time";
import createError from "http-errors";
import { writeTable, scanTable } from "./../api/Dynamo";
import { Cache } from "./../cache";

const RATINGS_CREDENTIALS = JSON.parse(
  fs.readFileSync(
    __dirname + "/../../credentials/ryankrolRatingsCredentials.json"
  )
);

const CACHE_TTL_MINUTES = 60 * 24;
let movieRatingsCache = null;
let albumRatingsCache = null;

const CACHE_DATA = {
  movie: {
    cache: null,
    tableName: "MovieRatings"
  },
  album: {
    cache: null,
    tableName: "AlbumRatings"
  }
};

const router = express.Router();

function getCacheInstance(type) {
  if (!CACHE_DATA[type]) {
    throw new Error("Cache type not found");
  }

  if (CACHE_DATA[type].cache) {
    return CACHE_DATA[type].cache;
  }

  const cacheFunction = () => {
    return scanTable(CACHE_DATA[type].tableName);
  };

  CACHE_DATA[type].cache = new Cache(cacheFunction, CACHE_TTL_MINUTES);

  return CACHE_DATA[type].cache;
}

// rating creation middleware
router.post("/*", async (req, res, next) => {
  if (req.body.password !== RATINGS_CREDENTIALS.password) {
    res.send({ message: "Incorrect Password" });
  } else {
    // remove a password from potentially being stored
    delete req.body.password;

    // add the current date to the storage payload
    req.body.date = date.format(new Date(), "DD-MM-YYYY");

    // handover to the specific handler
    next();
  }
});

// specific routes

// create a new movie rating
router.post("/movie", async (req, res, next) => {
  const callback = () => {
    res.send({ message: "Movie Write Complete!" });
  };
  writeTable(MOVIE_RATINGS_TABLE, req.body, callback);
});

// fetch all movie ratings
router.get("/movie", async (req, res, next) => {
  try {
    const cache = getCacheInstance("movie");
    const data = await cache.fetchData();

    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

// create a new album rating
router.post("/album", async (req, res, next) => {
  const callback = () => {
    res.send({ message: "Album Write Complete!" });
  };
  writeTable(ALBUM_RATINGS_TABLE, req.body, callback);
});

// fetch all album ratings
router.get("/album", async (req, res, next) => {
  try {
    const cache = getCacheInstance("album");
    const data = await cache.fetchData();

    res.send(data);
  } catch (e) {
    next(createError(500));
  }
});

export default router;
