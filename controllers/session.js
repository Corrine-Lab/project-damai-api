import dotenv from 'dotenv';
import request from 'request';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

dotenv.config();

const login = async ( req, res ) => {
  const { code } = req.body;
  const openId = await fetchWxOpenId( code );
  
  try {
    const user = await User.find( { openId } );
    if ( !user.length ) {
      createUser( openId )
    } else {
      const token = generateToken( user[0] );
      res.status( 200 ).json( { success: true, data: user[0], token } )
    }
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchWxOpenId = code => {
  return new Promise( ( resolve, reject ) => {
    const appId = process.env.APP_ID;
    const appSecret = process.env.APP_SECRET;
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ appId }&secret=${ appSecret }&js_code=${ code }&grant_type=authorization_code`;

    request( url, ( error, response, body ) => resolve( JSON.parse( body )['openid'] ) )
  } )
};

const createUser = async openId => {
  try {
    const user = await User.create( { openId } );
    const token = makeToken( user );
    res.status( 200 ).json( { success: true, data: user, token } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const generateToken = user => {
  const token = jwt.sign( { openId: user.openId, id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' } );
  return token;
};

export { login };
