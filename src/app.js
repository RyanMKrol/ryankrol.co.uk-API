// app.js
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import cors from "cors";

import albumsRouter from "./routes/albums";
import booksRouter from "./routes/books";
import moviesRouter from "./routes/movies";
import ratingsRouter from "./routes/ratings";

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/albums", albumsRouter);
app.use("/api/books", booksRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/ratings", ratingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

export default app;
