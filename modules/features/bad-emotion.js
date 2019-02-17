'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function () {
    return util.getRandomAnswer(messages.bad_emotion);
};