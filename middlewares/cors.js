const cors = require('cors');

// set cross origin resource sharing options
const corsOptions = {
    origin: '*', // Allow all origins to access the API
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers to be sent with requests
    exposedHeaders: ['Content-Type', 'Authorization'], // Allow these headers to be exposed to clients
    credentials: true, // Allow cookies to be sent with requests
    maxAge: 86400 // Cache CORS preflight requests for 24 hours
};

module.exports = cors(corsOptions);