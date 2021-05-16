// app.js
import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import cors from 'cors';

import exampleRouter from './modules/routes/example';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/example/endpoint', exampleRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

export default app;
