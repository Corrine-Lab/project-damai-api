import express from 'express';
import auth from '../middleware/auth.js';
import { fetchComedianFollowings, createComedianFollowing, deleteComedianFollowing } from '../controllers/comedianFollowing.js';

const router = express.Router();

router.get( '/', auth , fetchComedianFollowings);
router.post( '/', auth, createComedianFollowing );
router.delete( '/', auth, deleteComedianFollowing );

export default router;
