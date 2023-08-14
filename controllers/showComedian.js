import ShowComedian from '../models/showComedian.js';
import { showComedians } from '../constants/index.js';
import { checkId } from './utils.js';

const createShowComedian = async ( req, res ) => {
  const { showId, comedianId } = req.body;

  try {
    const newShowComedian = await ShowComedian.create( { showId, comedianId } );
    res.status( 201 ).json( { success: true, data: newShowComedian } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const deleteShowComedian = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    await ShowComedian.findByIdAndDelete( id );
    res.status( 200 ).json( { success: true, message: 'ShowComedian deleted successfully' } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const generateShowComedians = async ( req, res ) => {
  try {
    const len = showComedians.length;

    showComedians.forEach( async ( sc, index ) => {
      await ShowComedian.create( { ...sc } );

      if ( index === len - 1 ) {
        res.status( 201 ).json( { success: true, message: `${ len } showComedians have been created` } );
      }
    } )
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

export {
  createShowComedian,
  deleteShowComedian,
  generateShowComedians
};
