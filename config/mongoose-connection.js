const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Adjust the path

const mongoose = require('mongoose');
const debug = require('debug')('development:mongoose');

const dbHost = process.env.URL;

if (!dbHost) {
    console.log('Resolved .env path:', path.resolve(__dirname, '../.env'));
    console.log('Environment Variable URL:', process.env.PASSWORD);

  console.error('Error: The database URL is undefined. Check your .env file.');
  process.exit(1); // Exit the process if the URL is not defined
}

(async () => {
  try {
    await mongoose.connect(dbHost);
    console.log('Mongoose connected successfully');
  } catch (error) {
    debug('Mongoose connection error:', error.message);
    process.exit(1); // Exit the process on connection failure
  }
})();


module.exports = mongoose.connection;


 