import Show from '../models/show.js';
import Club from '../models/club.js';
import Booking from '../models/booking.js';
import User from '../models/user.js';
import ShowComedian from '../models/showComedian.js';
import { shows } from '../constants/index.js';
import { checkId, isDateExpired } from './utils.js';

const fetchUpcomingShows = async ( req, res ) => {
  const { query, page } = req.query;

  try {
    let shows;
    const pageSize = 3;
    const pattern = new RegExp( query, 'ig' );

    if ( query && query !== '' ) {
      shows = await Show.find( { $or: [ { name: pattern }, { description: pattern  }, { address: pattern  } ] } ).sort( { createdAt: -1 } );
    } else {
      shows = await Show.find().sort( { createdAt: -1 } );
    }

    const upcomingShows = await filterUpcomingShows( shows );
    const total = upcomingShows.length;
    const startIndex = ( Number( page ) - 1 ) * pageSize;
    const listShows = upcomingShows.slice( startIndex, startIndex + pageSize );
    const newShows = await fetchShowsClubs( listShows );

    res.status( 200 ).json( { success: true, data: newShows, currentPage: page, totalPages: Math.ceil( total / pageSize ) } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const filterUpcomingShows = shows => new Promise( ( resolve, reject ) => {
  const len = shows.length;
  let upcomingShows = [];

  shows.forEach( ( show, index ) => {
    if ( !isDateExpired( show ) ) upcomingShows.push( show );
    if ( index === len - 1 ) resolve( upcomingShows );
  } )
} );

const fetchShowsClubs = shows => new Promise( ( resolve, reject ) => {
  const len = shows.length;
  if ( len === 0 ) {
    resolve( [] );
    return false;
  };
  let newShows = [];

  const handleShows = async () => {
    for ( let i = 0; i < len; i++ ) {
      const show = shows[i];
      const club = await Club.findById( show.clubId );
      const newShow = {
        id: show._id,
        name: show.name,
        description: show.description,
        address: show.address,
        date: show.date,
        startTime: show.startTime,
        endTime: show.endTime,
        poster: show.poster,
        club
      };
      newShows.push( newShow );

      if ( i === len - 1 ) resolve( newShows );
    }
  }

  handleShows();
} );

const fetchShowInfo = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    const show = await Show.findById( id );
    const club = await fetchShowClub( show.clubId );

    const bookings = await Booking.find( { showId: id } );
    const audiences = bookings.length === 0 ? [] : await fetchShowAudiences( bookings );

    const showComedians = await ShowComedian.find( { showId: id } );
    const comedians = showComedians.length === 0 ? [] : await fetchShowComedians( showComedians );

    const newShow = {
      _id: show._id,
      name: show.name,
      description: show.description,
      address: show.address,
      date: show.date,
      startTime: show.startTime,
      endTime: show.endTime,
      poster: show.poster,
      club,
      audiences,
      comedians
    };

    res.status( 200 ).json( { success: true, data: newShow } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchShowClub = clubId => new Promise( ( resolve, reject ) => {
  const handleClub = async () => { 
    const club = await Club.findById( clubId );
    resolve( club );
  }

  handleClub();
} );

const fetchShowComedians = showComedians => new Promise( ( resolve, reject ) => {
    let comedians = [];
    const len = showComedians.length;

    const handleShowComedians = async () => {
      for ( let i = 0; i < len; i++ ) {
        const sc = showComedians[i];
        const comedian = await User.findById( sc.comedianId );
        comedians.unshift( comedian );

        if ( i === len - 1 ) {
          resolve( comedians );
        }
      }
    }

    handleShowComedians();
} );

const fetchShowAudiences = bookings => new Promise( ( resolve, reject ) => {
  const len = bookings.length;
  let audiences = [];

  const handleBookings = async () => {
    for ( let i = 0; i < len; i++ ) {
      const booking = bookings[i];
      const user = await User.findById( booking.userId );
      audiences.unshift( user );
  
      if ( i === len - 1 ) {
        resolve( audiences );
      }
    }
  }

  handleBookings();
} );

const createShow = async ( req, res ) => {
  const { name, description, date, startTime, endTime, address, clubId } = req.body;

  try {
    const newShow = await Show.create( { name, description, date, startTime, endTime, address, clubId } );
    res.status( 201 ).json( { success: true, data: newShow } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const updateShow = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  const { name, description, date, startTime, endTime, address, clubId } = req.body;
  try {
    const updatedShow = await Show.findByIdAndUpdate( id, { name, description, date, startTime, endTime, address, clubId }, { new: true } );
    res.status( 200 ).json( { success: true, data: updatedShow } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const deleteShow = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    await Show.findByIdAndDelete( id );
    res.status( 200 ).json( { success: true, message: 'Show deleted successfully' } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const generateShows = async ( req, res ) => {
  try {
    const len = shows.length;

    shows.forEach( async ( show, index ) => {
      await Show.create( { ...show } );

      if ( index === len - 1 ) {
        res.status( 201 ).json( { success: true, message: `${ len } shows have been created` } );
      }
    } )
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

export {
  fetchUpcomingShows,
  fetchShowInfo,
  createShow,
  updateShow,
  deleteShow,
  generateShows,
  fetchShowsClubs
};
