'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (session, updateUserSession) {

    let answers = util.getRandomAnswer(messages.action_reset);

    if (updateUserSession) {

        // Remember to keep this synced to sessions._createUserSession
        updateUserSession({
            first_time: true,
            last_target: undefined,
            last_action: undefined,
            jokes_amount: 0,
            reset_amount: session.reset_amount + 1
        });
    }

    return answers;
};