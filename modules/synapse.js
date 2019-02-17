'use strict';

const
    sessions = require('./sessions'),
    greetings = require('./features/greetings'),
    functionality = require('./features/functionality'),
    help = require('./features/help'),
    knowledge = require('./features/knowledge'),
    jokes = require('./features/jokes'),
    repeat = require('./features/repeat'),
    reset = require('./features/reset'),
    puzzling = require('./features/puzzling');

function _updateUserSession(uid, action, update_data) {

    if (!update_data) {
        // If not provided, set an default value for it
        update_data = {};
    }

    if (action !== false) {
        // Merge executed action into data to update
        update_data.last_action = action;
    }

    sessions.setProperty(uid, update_data);
}

function _checkRepetition(list, repeat_entity) {

    // Check for repeat entity into given list
    let repeat_index = list.indexOf(repeat_entity);

    // Checks if any reference for a previously used repeat exists
    if (repeat_index != -1) {

        // Removes the repeat entity from list
        list.splice(repeat_index, 1);

        return true;
    }

    return false;
}

function interpretAction(session, action, targets, infos, contexts_amount) {

    let answers;

    if (_checkRepetition(targets, 'target_repeat')) {

        if (session.last_target) {
            // Insert last referenced target by user into targets
            targets.push(session.last_target);
        }
    }

    if (action === 'action_repeat') {

        if (session.last_action) {
            // Insert last referenced action by user into actions
            action = session.last_action;
        }
    }

    // Handle action based on the given code
    if (action === 'action_greetings') {

        // User says 'hi'
        answers = greetings(session, (update_data) => {
            _updateUserSession(session.uid, action, update_data);
        });

        // If only one context was found and it has a greeting action,
        // ask if the user need any help.
        if (contexts_amount === 1) {
            // Does not update session.last_action
            answers = answers.concat(help());
        }

    } else if (action === 'action_functionality') {

        // User asked about the functionality of something
        answers = functionality(targets, (update_data) => {
            _updateUserSession(session.uid, action, update_data);
        });

    } else if (action === 'action_help') {

        // User requires help with something
        answers = help((update_data) => {
            _updateUserSession(session.uid, action, update_data);
        });

    } else if (action === 'action_knowledge') {

        answers = knowledge(targets, infos, (update_data) => {
            _updateUserSession(session.uid, action, update_data);
        });

    } else if (action === 'action_tell_joke') {

        answers = jokes(session, (update_data, update_action) => {
            _updateUserSession(
                session.uid,
                (update_action === false) ? false : action,
                update_data
            );
        });

    } else if (action === 'action_repeat') {

        answers = repeat((update_data) => {
            // Set action to false so it is not updated
            _updateUserSession(session.uid, false, update_data);
        });

    } else if (action === 'action_reset') {

        answers = reset(session, (update_data) => {
            // Set action as undefined (default value)
            _updateUserSession(session.uid, undefined, update_data);
        });

    } else {

        answers = puzzling((update_data) => {
            // Set action to false so it is not updated
            _updateUserSession(session.uid, false, update_data);
        });

    }

    // Answers is either an array or a promise
    return answers;
}

function interpretContext(session, context, contexts_amount) {

    let answers;

    // The priority is to find a single action inside the given context
    if (context.actions.length) {

        // Due the way text._extract is implemented, every context, should have only one action.
        // If more than one action is found, one of them should be chosen.
        let action = context.actions[0];

        // Emotions are ignored when there is an action
        answers = interpretAction(session, action, context.targets, context.infos, contexts_amount)

    } else {

        // When no action is found, search for additional information, such as
        // emotions, infos, targets...
        if (context.emotions) {
            // TODO
        } else {
            answers = puzzling((update_data) => {
                // Set action as undefined (default value)
                _updateUserSession(session.uid, undefined, update_data);
            });
        }
    }

    return answers;
}

module.exports = {
    interpretContext
};