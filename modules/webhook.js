'use strict';

const handler = require('./handler');

function post(req, res) {  

    // Body contains all messages received
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {

            // Gets the message event. entry.messaging is an array, but 
            // will only ever contain one message event, so we get index 0
            let event = entry.messaging[0];

            // Get the sender PSID
            let uid = event.sender.id;

            let message;

            // Both messages and postbacks are handled the same way
            // this is done to ensure that the bot can chat
            if (event.message) {
                message = event.message.text;
            } else if (event.postback) {
                message = event.postback.payload;
            }

            if (message) {
                handler.handleMessage(uid, message);
            }
        });

        // Respond the request
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Event is not from a page subscription
        res.sendStatus(404);
    }
}

// Adds support for GET requests to our webhook
function get(req, res) {  

    // Validation is set as environment variable to keep it secret
    if (!process.env.VERIFY_TOKEN) {
        throw new Error('Missing Verification Token');
    }

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Verify tokens does not match
            res.sendStatus(403);      
        }
    }
}

module.exports = {
    get,
    post
};