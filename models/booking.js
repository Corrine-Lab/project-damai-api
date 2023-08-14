import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema( {
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  showId: { type: mongoose.Schema.Types.ObjectId, required: true }
} );

export default mongoose.model( 'Booking', bookingSchema );
