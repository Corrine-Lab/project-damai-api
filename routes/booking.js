import express, { Router } from 'express';
import auth from '../middleware/auth.js';
import { createBooking, deleteBooking, generateBookings } from '../controllers/booking.js';

const router = express.Router();

router.post( '/', auth, createBooking );
router.delete( '/:id', auth, deleteBooking );
router.post( '/generate', generateBookings );

export default router;
