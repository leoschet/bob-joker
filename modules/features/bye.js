'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (updateUserSession) {

    let answers;

    answers = util.getRandomAnswer(messages.bye);

    if (updateUserSession) {
        updateUserSession();
    }

    return answers;
};