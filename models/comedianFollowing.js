import mongoose from 'mongoose';

const comedianFollowingSchema = new mongoose.Schema( {
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  comedianId: { type: mongoose.Schema.Types.ObjectId, required: true }
} );

export default mongoose.model( 'ComedianFollowing', comedianFollowingSchema );