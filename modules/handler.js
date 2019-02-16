'use strict';

const
    text = require('./text'),
    synapse = require('./synapse'),
    sessions = require('./sessions');

// Handles messages events
function handleMessage(uid, message) {

    // Get session for current user
    let session = sessions.getUserSession(uid);

    // Process incoming message, extracting found contexts
    let contexts = text.pipeline(message);

    let answers = contexts.map((context) => {
        return synapse.interpretContext(session, context, contexts.length);
    });

    return answers;
}



module.exports = {
    handleMessage
};