'use strict';

const
    request = require('request'),
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (session, updateUserSession) {

    let answers;

    if (session.jokes_amount < 10) {
        request('http://api.icndb.com/jokes/random?limitTo=[nerdy]', function (error, response, data) {

            // Check for errors and status code
            if (!error && response.statusCode === 200 && data.type === 'success') {
                answers = data.value.joke;
            } else {
                answers = util.getRandomAnswer(messages.action_tell_joke.error);
            }
        });
    } else {
        answers = util.getRandomAnswer(messages.action_tell_joke.limit);

        
    }

    if (updateUserSession) {
        updateUserSession({
            jokes_amount: session.jokes_amount + 1
        });
    }

    return answers;
};