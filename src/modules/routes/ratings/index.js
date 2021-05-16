// routes/ratings.js
import express from 'express';
// import { writeTable, scanTable } from "./../api/Dynamo";

import createGetRoutes from './get';
import createPostRoutes from './post';

const router = express.Router();

createGetRoutes(router);
createPostRoutes(router);

export default router;
