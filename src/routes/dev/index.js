import express from 'express';
import cacheRouter from './cache';

const router = express.Router();

router.use('/cache', cacheRouter);

export default router;
