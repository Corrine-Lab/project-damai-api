import Booking from '../models/booking.js';
import { bookings } from '../constants/index.js';
import { checkId } from './utils.js';

const createBooking = async ( req, res ) => {
  const { showId } = req.body;

  try {
    const newBooking = await Booking.create( { userId: req.userId, showId } );
    res.status( 201 ).json( { success: true, data: newBooking } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const deleteBooking = async ( req, res ) => {
  const { id } = req.params;
  checkId( id, res );

  try {
    await Booking.deleteOne( { showId: id, userId: req.userId } );
    res.status( 200 ).json( { success: true, message: 'Booking deleted successfully' } );
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

const generateBookings = async ( req, res ) => {
  try {
    const len = bookings.length;

    bookings.forEach( async ( booking, index ) => {
      await Booking.create( { ...booking } );

      if ( index === len - 1 ) {
        res.status( 201 ).json( { success: true, message: `${ len } bookings have been created` } );
      }
    } )
  } catch (error) {
    res.status( 500 ).send( error );
  }
};

export {
  createBooking,
  deleteBooking,
  generateBookings
};
