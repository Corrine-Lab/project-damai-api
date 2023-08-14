import mongoose from 'mongoose';

const clubFollowingSchema = new mongoose.Schema( {
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, required: true }
} );

export default mongoose.model( 'ClubFollowing', clubFollowingSchema );