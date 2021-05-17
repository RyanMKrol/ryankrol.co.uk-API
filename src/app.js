// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import cors from 'cors';

import {
  RATINGS_ENDPOINT,
  LISTENS_ENDPOINT,
  BOOKS_ENDPOINT,
  MOVIES_ENDPOINT,
} from './modules/constants';

import ratingsRouter from './modules/routes/ratings';
import listensRouter from './modules/routes/listens';
import booksRouter from './modules/routes/books';
import moviesRouter from './modules/routes/movies';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(RATINGS_ENDPOINT, ratingsRouter);
app.use(LISTENS_ENDPOINT, listensRouter);
app.use(BOOKS_ENDPOINT, booksRouter);
app.use(MOVIES_ENDPOINT, moviesRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

export default app;
