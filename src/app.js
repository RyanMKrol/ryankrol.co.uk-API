import path from 'path';
import createError from 'http-errors';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import bookRouter from './routes/ratings/book';
import albumRouter from './routes/ratings/album';

const LOGGER_FORMAT = 'dev';

const app = express();

app.use(logger(LOGGER_FORMAT));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ratings/book', bookRouter);
app.use('/ratings/album', albumRouter);

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
