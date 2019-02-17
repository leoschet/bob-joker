'use strict';

const
    util = require('./util'),
    messages = require('../vocabulary/messages');

module.exports = function (targets, updateUserSession) {

    let answers;
    let target;

    if (targets.length === 1) {

        target = targets[0];

        // Target what specified
        answers = util.getRandomAnswer(messages.action_functionality[target]);

        // Handle questions like "when is it then?"
        target = 'target_comedians_club';

    } else {
        // No target or multiple targets were given
        answers = util.getRandomAnswer(messages.action_functionality.general);
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