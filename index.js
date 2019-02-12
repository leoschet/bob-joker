'use strict';

// Import dependencies
const 
    express = require('express'),
    bodyParser = require('body-parser'),
    webhook = require('./modules/webhook');

// Create HTTP server
const app = express().use(bodyParser.json());

// Setup app routes
app.post('/webhook', webhook.post);
app.get('/webhook', webhook.get);

// Sets server port and logs message on success
app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));