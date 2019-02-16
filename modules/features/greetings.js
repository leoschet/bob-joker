'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (session, updateUserSession) {

    let answers;

    if (session.first_time) {
        // New user arrived
        answers = util.getRandomAnswer(messages.action_greetings.first_time);
    } else {
        // Recurrent user
        answers = util.getRandomAnswer(messages.action_greetings.next_times);
    }

    if (updateUserSession) {
        updateUserSession({
            first_time: false
        });
    }

    return answers;
};