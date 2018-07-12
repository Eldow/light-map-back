// Get dependencies
import express from 'express';
import path from 'path';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';

import { seed, mongoUri } from './config';
import statisticsRoutes from './statistics/routes';
import statisticsSeed from './statistics/seed';

// Mongo configuration
const mongoDB = process.env.MONGODB_URI || mongoUri;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

if (seed) {
  try {
    statisticsSeed();
  }
  catch(err) {
    console.log('error while seeding the data');
  }
}

// Bodyparser and cors configuration
const app = express();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve client dist
app.use(express.static(path.join(__dirname, '../dist/light-map')));

// Set our api routes
app.use('/api/statistics', statisticsRoutes);

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/light-map/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4200';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));