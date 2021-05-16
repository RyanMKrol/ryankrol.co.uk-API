// routes/books.js
import express from "express";
import { fetchBooks } from "./../api/GoogleBooks";
import { Cache } from "./../cache";

const CACHE_TTL_MINUTES = 1440;
const booksCache = new Cache(fetchBooks, CACHE_TTL_MINUTES);

const router = express.Router();

router.get("/", async (req, res, next) => {
  const books = await booksCache.fetchData();
  res.send(books);
});

export default router;
