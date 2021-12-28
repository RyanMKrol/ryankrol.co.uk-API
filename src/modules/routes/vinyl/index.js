// routes/vinyl.js
import express from 'express';

import createGetRoutes from './get';
import createPostRoutes from './post';

const router = express.Router();

createGetRoutes(router);
createPostRoutes(router);

export default router;
