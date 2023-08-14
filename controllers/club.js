import Club from '../models/club.js';
import User from '../models/user.js';
import Show from '../models/show.js';
import { clubs } from '../constants/index.js';
import { checkId } from './utils.js';

const createClub = async ( req, res ) => {
  try {
    const existClub = await Club.find( { userId: req.userId } );
    if ( existClub.length !== 0 ) {
      res.status( 400 ).json( { success: false, mesage: 'The current user has already registered a club' } );
      return false;
    }

    const { name, address, description } = req.body;
    const newClub = await Club.create( { name, address, description, userId: req.userId } );
    res.status( 201 ).json( { success: true, data: newClub } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchClubs = async ( req, res ) => {
  const { page, query } = req.query;

  try {
    const pageSize = 8;
    const total = await Club.countDocuments();
    const startIndex = ( Number( page ) - 1 ) * pageSize;
    const pattern = new RegExp( query, 'ig' );
    let clubs;

    if ( query && query !== '' ) {
      clubs = await Club.find( { $or: [ { name: pattern }, { description: pattern } ] } ).sort( { createdAt: -1 } ).skip( startIndex ).limit( pageSize );
    } else {
      clubs = await Club.find().sort( { createdAt: -1 } ).skip( startIndex ).limit( pageSize );
    }

    const newClubs = await fetchClubsManager( clubs );
    res.status( 200 ).json( { success: true, data: newClubs, currentPage: page, totalPages: Math.ceil( total / pageSize ) } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const fetchClubsManager = clubs => new Promise( ( resolve, reject ) => {
  const len = clubs.length;
  let newClubs = [];

  const handleManager = async () => {
    for ( let i = 0; i < len; i++ ) {
      const club = clubs[i]
      const manager = await User.findById( club.userId );
      const newClub = {
        id: club._id,
        name: club.name,
        address: club.address,
        description: club.description,
        manager
      };
      newClubs.push( newClub );

      if ( i === len - 1 ) resolve( newClubs );
    }
  }

  handleManager();
} );

const fetchClubInfo = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    const club = await Club.findById( id );
    const manager = await User.findById( club.userId );
    const shows = await Show.find( { clubId: club._id } ).sort( { createdAt: -1 } );
    const newClub = { 
      id: club.id,
      name: club.name,
      address: club.address,
      description: club.description,
      manager,
      shows
     };
    res.status( 200 ).json( { success: true, data: newClub } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const updateClubInfo = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  const { name, address, description } = req.body;
  try {
    const updatedClub = await Club.findByIdAndUpdate( id, { name, address, description }, { new: true } );
    res.status( 200 ).json( { success: true, data: updatedClub } );
  } catch (error) {
    res.status( 500 ).send( error )
  }
};

const generateClubs = async ( req, res ) => {
  try {
    const len = clubs.length;

    clubs.forEach( async ( club, index ) => {
      await Club.create( { ...club } );

      if ( index === len - 1 ) {
        res.status( 201 ).json( { success: true, message: `${ len } clubs have been created` } );
      }
    } )
  } catch (error) {
    res.status( 500 ).send( error );
  }
}

export {
  createClub,
  fetchClubs,
  fetchClubInfo,
  updateClubInfo,
  fetchClubsManager,
  generateClubs
};
