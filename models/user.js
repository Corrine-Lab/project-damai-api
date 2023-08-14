import mongoose from 'mongoose';

const userSchema = new mongoose.Schema( {
  openId: { type: String },
  nickname: { type: String, default: '路人甲' },
  role: { type: String, default: 'audience' },
  experience: { type: String, default: '空空如也' },
  slogan: { type: String, default: '新人一枚多多关照' },
  avatar: { type: String, default: 'https://hobos-final.oss-cn-shanghai.aliyuncs.com/default-avatar.jpg' }
}, { timestamps: true } );

export default mongoose.model( 'User', userSchema );
