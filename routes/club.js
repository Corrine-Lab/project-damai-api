import express from 'express';
import auth from '../middleware/auth.js';
import { createClub, fetchClubs, generateClubs, fetchClubInfo, updateClubInfo } from '../controllers/club.js';

const router = express.Router();

router.post( '/', auth, createClub );
router.get( '/', auth, fetchClubs );
router.get( '/:id', auth, fetchClubInfo );
router.patch( '/:id', auth, updateClubInfo );
router.post( '/generate', generateClubs );

export default router;