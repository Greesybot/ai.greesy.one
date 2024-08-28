// pages/api/middlware/cors.js

import Cors from 'micro-cors';

// Initialize CORS middleware
var whitelist = [process.env.PROJECT_URL, process.env.NEXTAUTH_URL]
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
const cors = Cors({
   origin: process.env.PROJECT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    ...corsOptions
    // Allow specific HTTP methods
});

export default cors;
