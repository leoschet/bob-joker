'use strict';

const
    Promise = require('promise'),
    sessions = require('./sessions'),
    text = require('./text'),
    synapse = require('./synapse'),
    sender = require('./facebook/send-api');

// Handles messages events
function handleMessage(uid, message) {

    // Get session for current user
    let session = sessions.getUserSession(uid);

    // Start typing before even start message processing
    sender.startTyping(uid, () => {

        // Process incoming message, extracting found contexts
        let contexts = text.pipeline(message);

        // Answers is an array of promises
        let answers = contexts.map((context) => {
            return synapse.interpretContext(session, context, contexts.length)
        });

        Promise.all(answers).then((messages) => {

            // Flattern messages' array
            messages = [].concat.apply([], messages)

            console.log(messages)
            sender.syncText(uid, messages)
        });
    });

}

module.exports = {
    handleMessage
};