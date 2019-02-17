'use strict';

const request = require('request');

function _getBaseOptions(uid) {
    return {
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        method: 'POST',
        json: {
            recipient: {
                id: uid
            }
        },
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        }
    };
}

function _sender_action(uid, sender_action, callback) {
    // Create options object
    let options = _getBaseOptions(uid);
    options.json.sender_action = sender_action;

    // Send current message
    request(options, function (error, response, body) {
        if (error) {
            // Some error occured
            console.error('Error sending messages');
        } else if (response.body.error) {
            // Some error occured
            console.error('Error: ', response.body.error);
        } else {
            console.log('Sender action ' + sender_action + 'executed for user: ' + uid);

            if (callback) {
                callback()
            }
        }
    });
}

function startTyping(uid, callback) {
    _sender_action(uid, 'typing_on', callback);
}

function stopTyping(uid, callback) {
    _sender_action(uid, 'typing_on', callback);
}

function syncText(uid, messages, callback, index = 0) {

    if (index < messages.length) {

        // Create options object
        let options = _getBaseOptions(uid);
        options.json.messaging_type = 'RESPONSE';
        options.json.message = {
            text: messages[index]
        };

        // Send current message
        request(options, function (error, response, body) {
            if (error) {
                // Some error occured
                console.error('Error sending messages');
            } else if (response.body.error) {
                // Some error occured
                console.error('Error: ', response.body.error);
            } else {
                console.log('Message sent!');

                if (index + 1 < messages.length) {
                    // Make sure to start typing before sending message
                    startTyping(uid, () => {
                        // Send next message with a delay of 1.25 seconds
                        setTimeout(() => {
                            syncText(uid, messages, callback, index + 1);
                        }, 1250);
                    });
                }
            }
        });
    } else {
        // Code only gets here if no message was received
        if (callback) {
            callback();
        }
    }
}

module.exports = {
    startTyping,
    stopTyping,
    syncText
}