'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (updateUserSession) {

    let answers;

    answers = util.getRandomAnswer(messages.action_help);

    if (updateUserSession) {
        updateUserSession({
            last_target: 'target_comedians_club'
        });
    }

    return answers;
};