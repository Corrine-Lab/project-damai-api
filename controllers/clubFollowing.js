import ClubFollowing from '../models/clubFollowing.js';
import { checkId } from './utils.js';

const fetchClubFollowings = async ( req, res ) => {
  try {
    const cfs = await ClubFollowing.find( { userId: req.userId } );
    res.status( 200 ).json( { success: true, data: cfs } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const createClubFollowing = async ( req, res ) => {
  const { clubId } = req.body;

  try {
    const newClubFollowing = await ClubFollowing.create( { userId: req.userId, clubId } );
    res.status( 201 ).json( { success: true, data: newClubFollowing } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const deleteClubFollowing = async ( req, res ) => {
  const { clubId } = req.body;

  try {
    await ClubFollowing.findOneAndDelete( { userId: req.userId, clubId } );
    res.status( 200 ).json( { success: true, message: 'ClubFollowing deleted successfully' } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

export {
  fetchClubFollowings,
  createClubFollowing,
  deleteClubFollowing
};
