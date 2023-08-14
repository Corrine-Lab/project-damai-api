import express from 'express';
import auth from '../middleware/auth.js';
import { createShowComedian, deleteShowComedian, generateShowComedians } from '../controllers/showComedian.js';

const router = express.Router();

router.post( '/', auth, createShowComedian );
router.delete( '/:id', auth, deleteShowComedian );
router.post( '/generate', generateShowComedians );

export default router;
