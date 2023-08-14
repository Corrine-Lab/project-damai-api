import mongoose from 'mongoose';

const showSchema = new mongoose.Schema( {
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  address: { type: String, required: true },
  clubId: { type: mongoose.Schema.Types.ObjectId, required: true },
  poster: { type: String, default: 'https://hobos-final.oss-cn-shanghai.aliyuncs.com/default-poster.jpg' }
}, { timestamps: true } );

export default mongoose.model( 'Show', showSchema );
