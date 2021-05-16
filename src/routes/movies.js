// routes/movies.js
import express from "express";
import { fetchMovies } from "./../api/S3";
import { Cache } from "./../cache";

const CACHE_TTL_MINUTES = 1440;
const moviesCache = new Cache(fetchMovies, CACHE_TTL_MINUTES);

const router = express.Router();

router.get("/", async (req, res, next) => {
  const movies = await moviesCache.fetchData();
  res.send(movies);
});

export default router;
