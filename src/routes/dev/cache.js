import express from 'express';
import {
  handlerWithOptionalMiddleware,
  withAuthentication,
} from '../../lib/middleware';
import { SERVER_CACHES } from '../../lib/constants';

const router = express.Router();

router.delete('/', async (req, res) => {
  handlerWithOptionalMiddleware(
    req,
    res,
    withAuthentication,
    handleDelete,
  );
});

/**
 * Flushes all caches on the server
 */
function handleDelete() {
  Object.values(SERVER_CACHES).forEach((cache) => cache.flushAll());
}

export default router;
