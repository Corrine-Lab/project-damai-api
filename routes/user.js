import express from 'express';
import auth from '../middleware/auth.js';
import { fetchUserInfo, fetchComedianInfo, fetchBookedShows, fetchCreatedShows, updateUserInfo, generateUser, fetchComedians, fetchFollowedComedians, fetchFollowedClubs } from '../controllers/user.js';

const router = express.Router();

router.get( '/followed_comedians', auth, fetchFollowedComedians );
router.get( '/followed_clubs', auth, fetchFollowedClubs );
router.get( '/comedians/:id',auth, fetchComedianInfo );
router.get( '/comedians', auth, fetchComedians );
router.get( '/booked_shows', auth, fetchBookedShows );
router.get( '/created_shows', auth, fetchCreatedShows );
router.get( '/',auth, fetchUserInfo );
router.patch( '/', auth, updateUserInfo );
router.post( '/', generateUser );

export default router;
