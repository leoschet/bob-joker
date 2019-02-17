'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

function action(updateUserSession) {

    let answers;

    answers = util.getRandomAnswer(messages.puzzling.action);

    if (updateUserSession) {
        updateUserSession();
    }

    return answers;
}

function emotion() {
    return util.getRandomAnswer(messages.puzzling.emotion);
}

module.exports = {
    action,
    emotion
};