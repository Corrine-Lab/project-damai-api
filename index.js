import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import sessionRoutes from './routes/session.js';
import userRoutes from './routes/user.js';
import showRoutes from './routes/show.js';
import bookingRoutes from './routes/booking.js';
import clubFollowingRoutes from './routes/clubFollowing.js';
import comedianFollowingRoutes from './routes/comedianFollowing.js';
import clubRoutes from './routes/club.js';
import showComedianRoutes from './routes/showComedian.js';

// config
dotenv.config();

// init app
const app = express();

// middleware
app.use( bodyParser.json( { limit: '30mb', extended: true } ) );
app.use( bodyParser.urlencoded( { limit: '30mb', extended: true } ) );
app.use( cors() );

// routes
app.use( '/api/v1/session', sessionRoutes );
app.use( '/api/v1/users', userRoutes );
app.use( '/api/v1/shows', showRoutes );
app.use( '/api/v1/bookings', bookingRoutes );
app.use( '/api/v1/club_followings', clubFollowingRoutes );
app.use( '/api/v1/comedian_followings', comedianFollowingRoutes );
app.use( '/api/v1/clubs', clubRoutes );
app.use( '/api/v1/show_comedians', showComedianRoutes );

// mongodb
const port = process.env.PORT;
const url = process.env.MONGODB_URL;
mongoose.set( 'strictQuery', true );
mongoose.connect( url )
  .then( () => {
    console.log( 'Connected to mongodb' );
    app.listen( port, () => console.log( `Server running on port ${ port }` ) );
  } )
  .catch( error => console.log( error ) );
