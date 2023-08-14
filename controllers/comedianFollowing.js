import ComedianFollowing from '../models/comedianFollowing.js';
import { checkId } from './utils.js';

const fetchComedianFollowings = async ( req, res ) => {
  try {
    const cfs = await ComedianFollowing.find( { userId: req.userId } );
    res.status( 200 ).json( { success: true, data: cfs } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const createComedianFollowing = async ( req, res ) => {
  const { comedianId } = req.body;

  try {
    const newComedianFollowing = await ComedianFollowing.create( { userId: req.userId, comedianId } );
    res.status( 201 ).json( { success: true, data: newComedianFollowing } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const deleteComedianFollowing = async ( req, res ) => {
  const { comedianId } = req.body;
  checkId( comedianId, res );

  try {
    const cf = await ComedianFollowing.findOneAndDelete( { userId: req.userId, comedianId } );
    res.status( 200 ).json( { success: true, message: 'ComedianFollowing deleted successfully' } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

export {
  fetchComedianFollowings,
  createComedianFollowing,
  deleteComedianFollowing
};
