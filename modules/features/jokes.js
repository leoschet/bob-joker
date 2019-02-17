'use strict';

const
    Promise = require('promise'),
    request = require('request'),
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (session, updateUserSession) {

    let answers;

    if (session.jokes_amount < 10) {

        answers = new Promise((fulfill, _) => {
            request('http://api.icndb.com/jokes/random?limitTo=[nerdy]', function (error, response, data) {

                // If any data was give, parse it to access json properties
                data = (data) ? JSON.parse(data) : undefined    

                // Check for errors and status code
                if (!error && response.statusCode === 200 && data.type === 'success') {
                    fulfill(
                        data.value.joke
                    );
                } else {
                    fulfill(
                        util.getRandomAnswer(messages.action_tell_joke.error)
                    );
                }

            });
        });

        if (updateUserSession) {
            updateUserSession({
                jokes_amount: session.jokes_amount + 1
            });
        }

    } else {
        // Get message for when user reach daily jokes limit
        answers = util.getRandomAnswer(messages.action_tell_joke.limit);

        // Save how many times user's session has been reseted until now
        let reset_amount = session.reset_amount;

        // Set an timeout of 24 hours to reset user's joke limit
        setTimeout(
            () => {
                // Compare saved reset_amount with current amount
                // In case user's session was reseted in the mean time, do nothing
                if (reset_amount === session.reset_amount) {
                    if (updateUserSession) {
                        updateUserSession(
                            {
                                jokes_amount: 0
                            },
                            false // Meaning that last_action should not be updated
                        );
                    }
                }
            },
            1000 * 60 * 60 * 24 // 24 hours in ms
        );
    }

    return answers;
};