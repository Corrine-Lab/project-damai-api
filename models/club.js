import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema( {
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true }
}, { timestamps: true } );

export default mongoose.model( 'Club', clubSchema );
