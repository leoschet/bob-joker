'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (targets, infos, updateUserSession) {

    let answers;
    let target;

    if (targets.length > 1 || infos.length > 1) {

        // Either too many targets or information were given
        answers = util.getRandomAnswer(messages.action_knowledge.too_much);

    } else if (targets.length === 1) {

        target = targets[0];

        if (infos.length === 1) {
            // Information was specified
            answers = util.getRandomAnswer(messages.action_knowledge[target][infos[0]]);
        } else {
            // No information was provided
            answers = util.getRandomAnswer(messages.action_knowledge[target].general);
        }
    } else {
        // No target was provided
        answers = util.getRandomAnswer(messages.action_knowledge.general);
    }

    // Prevent that last target gets erased when no target was provided
    let update_data = {};
    if (target) {
        update_data.last_target = target;
    }

    if (updateUserSession) {
        updateUserSession(update_data);
    }

    return answers;
};