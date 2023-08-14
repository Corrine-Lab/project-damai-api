import mongoose from 'mongoose';

const checkId = ( id, res ) => {
  if ( !mongoose.Types.ObjectId.isValid( id ) ) {
    return res.status( 400 ).send( 'Not a valid id' );
  }
};

const isDateExpired = ( show ) => {
    const date = show.date.split( '/' )
		const startHour = show.startTime.split( ':' )[0]
		const startMin = show.startTime.split( ':' )[1]
		const startTime = new Date(
			Number.parseInt(date[0], 10),
			Number.parseInt(date[1] - 1, 10),
			Number.parseInt(date[2], 10),
			Number.parseInt(startHour, 10),
			Number.parseInt(startMin, 10)
		);

    const currentTime = new Date();
    const result = currentTime.getTime() >= startTime.getTime();
    return result;
}

export {
  checkId,
  isDateExpired
};
