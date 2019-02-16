'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (updateUserSession) {

    let answers;

    answers = util.getRandomAnswer(messages.action_reset);

    if (updateUserSession) {

        // Remember to keep this synced to sessions._createUserSession
        updateUserSession({
            first_time: true,
            last_target: undefined,
            last_action: undefined,
            jokes_amount: 0,
            jokes_limit: false
        });
    }

    return answers;
};