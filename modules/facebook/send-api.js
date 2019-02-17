'use strict';

const request = require('request');

function syncText(uid, messages, index = 0) {

    if (index < messages.length) {

        let options = {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            method: 'POST',
            json: {
                messaging_type: 'RESPONSE',
                recipient: {
                    id: uid
                },
                message: {
                    text: messages[index]
                }
            },
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN
            }
        };

        console.log(options)

        // Send current message
        request(options, function (error, response, body) {
            if (error) {
                // Some error occured
                console.error('Error sending messages');
            } else if (response.body.error) {
                // Some error occured
                console.error('Error: ', response.body.error);
            } else {
                console.log('Message sent!')
                // Send next message
                syncText(uid, messages, index + 1);
            }
        });
    } else {
        return;
    }
}

module.exports = {
    syncText
}