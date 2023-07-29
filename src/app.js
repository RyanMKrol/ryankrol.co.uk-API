import path from 'path';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import ratingsRouter from './routes/ratings';
import vinylRouter from './routes/vinyl';

const LOGGER_FORMAT = 'dev';

const app = express();

app.use(logger(LOGGER_FORMAT));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/ratings', ratingsRouter);
app.use('/vinyl', vinylRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // render the error page
  res.status(err.status || 500).send(err.message);
});

app.listen(3000);
