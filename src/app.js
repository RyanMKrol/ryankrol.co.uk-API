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

app.use('/api/ratings', ratingsRouter);
app.use('/api/vinyl', vinylRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// need to keep next in the function signature, or the method doesn't get called
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

app.listen(8000);
