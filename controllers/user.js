import User from '../models/user.js';
import Booking from '../models/booking.js';
import ClubFollowing from '../models/clubFollowing.js';
import ComedianFollowing from '../models/comedianFollowing.js';
import ShowComedian from '../models/showComedian.js';
import Show from '../models/show.js';
import Club from '../models/club.js';
import { users } from '../constants/index.js';
import { checkId } from './utils.js';
import { fetchShowsClubs } from './show.js';
import { fetchClubsManager } from './club.js';

const fetchUserInfo = async ( req, res ) => {
  // try {
    console.log(req.userId)
    const user = await User.findById( req.userId );
    let followings, clubs;

    // if ( user.role === 'comedian' ) {
    //   followings = await ComedianFollowing.find( { comedianId: req.userId } );
    // } else if ( user.role === 'holder' ) {
    //   clubs = await Club.find( { userId: req.userId } );
    //   console.log(clubs)
    //   followings = await ClubFollowing.find( { clubId: clubs[0]._id } );
    // }

    const newUser = {
      id: user._id,
      nickname: user.nickname,
      role: user.role,
      avatar: user.avatar,
      slogan: user.slogan,
      experience: user.experience,
      // club: clubs[0],
      followings
    };
    res.status( 200 ).json( { success: true, data: newUser } );
  // } catch (error) {
  //   res.status( 500 ).send( error );
  // }
};

const fetchComedianInfo = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    const comedian = await User.findById( id );
    const showComedians = await ShowComedian.find( { comedianId: id } );
    const shows = await fetchComedianShows( showComedians );
    const newShows = await fetchShowsClubs( shows );

    const newComedian = {
      id: comedian._id,
      nickname: comedian.nickname,
      slogan: comedian.slogan,
      experience: comedian.experience,
      avatar: comedian.avatar,
      shows: newShows
    };
    res.status( 200 ).json( { success: true, data: newComedian } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchComedianShows = showComedians => new Promise( ( resolve, reject ) => {
  const len = showComedians.length;
  let shows = [];

  const handleShows = async () => {
    for ( let i = 0; i < len; i++ ) {
      const sc = showComedians[i];
      const show = await Show.findById( sc.showId ).sort( { createdAt: -1 } );
      shows.push( show );

      if ( i === len - 1 ) resolve( shows );
    }
  };

  handleShows();
} );

const updateUserInfo = async ( req, res ) => {
  const { nickname, role, experience, slogan, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate( req.userId, { nickname, role, experience, slogan, avatar }, { new: true } );
    res.status( 200 ).json( { success: true, data: updatedUser } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchClubFollowings = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    const clubFollowings = await ClubFollowing.find( { userId: id } );
    res.status( 200 ).json( { success: true, data: clubFollowings } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchFollowedComedians = async ( req, res ) => {
  try {
    const { page, query } = req.query;
    const cfs = await ComedianFollowing.find( { userId: req.userId } );
    const pageSize = 8;
    const startIndex = ( Number( page ) - 1 ) * pageSize;
    const comedians = await handleComedians( cfs );
    let listComedians, total;

    if ( query && query !== '' ) {
      const pattern = new RegExp( query, 'ig' );
      const searchedComedians = comedians.filter( comedian => pattern.test( comedian.nickname ) || pattern.test( comedian.slogan ) );
      total = searchedComedians.length;
      listComedians = searchedComedians.slice( startIndex, startIndex + pageSize );
    } else {
      total = comedians.length;
      listComedians = comedians.slice( startIndex, startIndex + pageSize )
    }

    res.status( 200 ).json( { success: true, data: listComedians, currentPage: page, totalPages: Math.ceil( total / pageSize ) } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const handleComedians = cfs => new Promise( ( resolve, reject ) => {
  const len = cfs.length;
  let comedians = [];

  const handleFetch = async () => {
    for ( let i = 0; i < len; i++ ) {
      const cf = cfs[i];
      const comedian = await User.findById( cf.comedianId );
      comedians.push( comedian );

      if ( i === len - 1 ) resolve( comedians );
    }
  };

  handleFetch();
} );

const fetchFollowedClubs = async ( req, res ) => {
  try {
    const { page, query } = req.query;
    const cfs = await ClubFollowing.find( { userId: req.userId } )
    const pageSize = 8;
    const startIndex = ( Number( page ) - 1 ) * pageSize;
    const endIndex = startIndex + pageSize;
    let clubs = await handleClubs( cfs );
    let total = clubs.length
    let listClubs;

    if ( query && query !== '' ) {
      const pattern = new RegExp( query, 'ig' );
      const searchedClubs = clubs.filter( club => pattern.test( club.name ) || pattern.test( club.address ) || pattern.test( club.description ) );
      total = searchedClubs.length;
      listClubs = searchedClubs.slice( startIndex, endIndex > total ? total : endIndex );
    } else {
      listClubs = clubs.slice( startIndex, endIndex > total ? total : endIndex )
    }

    const newListClubs = await fetchClubsManager( listClubs );
    res.status( 200 ).json( { success: true, data: newListClubs, currentPage: page, totalPages: Math.ceil( total / pageSize ) } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const handleClubs = cfs => new Promise( ( resolve, reject ) => {
  const len = cfs.length;
  let clubs = [];

  const handleFetch = async () => {
    for ( let i = 0; i < len; i++ ) {
      const cf = cfs[i];
      const club = await Club.findById( cf.clubId );
      clubs.push( club );

      if ( i === len - 1 ) resolve( clubs );
    }
  };

  handleFetch();
} );

const fetchComedians = async ( req, res ) => {
  const { page, query } = req.query;

  try {
    const pageSize = 8;
    const total = await User.countDocuments();
    const startIndex = ( Number( page ) - 1 ) * pageSize;
    const pattern = new RegExp( query, 'ig' );
    let comedians;

    if ( query && query !== '' ) {
      comedians = await User.find( { $and: [ { role: 'comedian' }, { $or: [ { nickname: pattern }, { slogan: pattern } ] } ] } ).sort( { createdAt: -1 } ).skip( startIndex ).limit( pageSize );
    } else {
      comedians = await User.find( { role: 'comedian' } ).sort( { createdAt: -1 } ).skip( startIndex ).limit( pageSize );
    }

    res.status( 200 ).json( { success: true, data: comedians, currentPage: page, totalPages: Math.ceil( total / pageSize ) } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchBookedShows = async ( req, res ) => {
  try {
    const bookings = await Booking.find( { userId: req.userId } );
    const shows = await fetchShows( bookings );
    const newShows = await fetchShowsClubs( shows );
    res.status( 200 ).json( { success: true, data: newShows } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const fetchShows = bookings => new Promise( ( resolve, reject ) => {
  const len = bookings.length;
  let shows = [];

  const handleFetch = async () => {
    for ( let i = 0; i < len; i++ ) {
      const show = await Show.findById( bookings[i].showId );
      shows.push( show );

      if ( i === len - 1 ) resolve( shows );
    }
  };

  handleFetch();
} );

const generateUser = async ( req, res ) => {
  try {
    const len = users.length;

    users.forEach( async ( user, index ) => {
      await User.create( { ...user } );

      if ( index === len - 1 ) {
        res.status( 201 ).json( { success: true, messahe: `${ len } users has been created` } );
      }
    } )
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchCreatedShows = async ( req, res ) => {
  try {
    const club = await Club.findOne( { userId: req.userId } );
    const shows = await Show.find( { clubId: club._id } );
    const newShows = await fetchShowsClubs( shows );
    res.status( 200 ).json( { success: true, data: newShows } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

export {
  fetchUserInfo,
  fetchComedianInfo,
  updateUserInfo,
  fetchBookedShows,
  fetchCreatedShows,
  fetchClubFollowings,
  fetchFollowedComedians,
  fetchFollowedClubs,
  fetchComedians,
  generateUser
};
