// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import cors from 'cors';

import exampleRouter from './modules/routes/example';
import ratingsRouter from './modules/routes/ratings';
import listensRouter from './modules/routes/listens';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/example/endpoint', exampleRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/listens', listensRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

export default app;
