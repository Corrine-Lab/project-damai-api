import mongoose from 'mongoose';

const showComedianSchema = new mongoose.Schema( {
  showId: { type: mongoose.Schema.Types.ObjectId, required: true },
  comedianId: { type: mongoose.Schema.Types.ObjectId, required: true }
} );

export default mongoose.model( 'ShowComedian', showComedianSchema );