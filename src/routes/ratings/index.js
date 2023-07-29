import express from 'express';
import albumRouter from './album';
import bookRouter from './book';
import movieRouter from './movie';
import tvRouter from './tv';

const router = express.Router();

router.use('/album', albumRouter);
router.use('/book', bookRouter);
router.use('/movie', movieRouter);
router.use('/tv', tvRouter);

export default router;
