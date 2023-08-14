import express from 'express';
import auth from '../middleware/auth.js';
import { createClubFollowing, deleteClubFollowing, fetchClubFollowings } from '../controllers/clubFollowing.js'

const router = express.Router();

router.get( '/', auth, fetchClubFollowings )
router.post( '/', auth, createClubFollowing );
router.delete( '/', auth, deleteClubFollowing );

export default router;
