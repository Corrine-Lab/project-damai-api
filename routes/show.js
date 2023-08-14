import express  from 'express';
import auth from '../middleware/auth.js';
import { fetchUpcomingShows, fetchShowInfo, createShow, updateShow, deleteShow, generateShows } from '../controllers/show.js';

const router = express.Router();

router.get( '/', fetchUpcomingShows );
router.get( '/:id', fetchShowInfo );
router.post( '/', auth, createShow );
router.patch( '/:id', auth, updateShow );
router.delete( '/:id', auth, deleteShow );
router.post( '/generate', generateShows );

export default router;
