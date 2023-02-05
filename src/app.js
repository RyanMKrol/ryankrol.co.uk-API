// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import cors from 'cors';

import {
  BOOKS_ENDPOINT,
  LISTENS_ENDPOINT,
  MOVIES_ENDPOINT,
  RATINGS_ENDPOINT,
  PORTFOLIO_ENDPOINT,
  VINYL_ENDPOINT,
} from './modules/constants';

import booksRouter from './modules/routes/books';
import listensRouter from './modules/routes/listens';
import moviesRouter from './modules/routes/movies';
import ratingsRouter from './modules/routes/ratings';
import portfolioRouter from './modules/routes/portfolio';
import vinylRouter from './modules/routes/vinyl';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(BOOKS_ENDPOINT, booksRouter);
app.use(LISTENS_ENDPOINT, listensRouter);
app.use(MOVIES_ENDPOINT, moviesRouter);
app.use(RATINGS_ENDPOINT, ratingsRouter);
app.use(PORTFOLIO_ENDPOINT, portfolioRouter);
app.use(VINYL_ENDPOINT, vinylRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

export default app;
