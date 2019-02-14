'use strict';

const
    text = require('./text'),
    messages = require('./vocabulary/messages'),
    sessions = require('./sessions');

// Handles messages events
function handleMessage(uid, message) {

    // Get session for current user
    let session = sessions.getUserSession(uid)

    // Process incoming message, extracting found contexts
    let contexts = text.pipeline(message);

    let answers = contexts.map((context) => {

        // The priority is to find a single action inside the given context
        if (context.actions.length == 1) {
            let action = context.actions[0];

            // Emotions are ignored when there is an action
            return handleAction(session, action, context.targets, context.infos, contexts.length);

        } else if (context.actions.length > 1) {
            // If more than one action is found, one of them should be chosen.
            // For now, the bot can process only one action at a time
            return 

        } else {
            // When no action is found, search for additional information, such as
            // emotions, infos, targets...
        }
    });

    return answers
}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function generateRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAnswer(options) {
    return options[
        generateRandomInt(0, options.length - 1)
    ]
}

function handleAction(session, action, targets, infos, contexts_amount) {

    let answers = [];

    // Fill in with last_target and last_action
    // TODO

    // Handle action based on the given code
    if (action === 'action_greetings') {

        if (session.first_time) {
            answers = answers.concat(
                getRandomAnswer(messages.action_greetings.first_time)
            )
        } else {
            answers = answers.concat(
                getRandomAnswer(messages.action_greetings.next_times)
            )
        }

        // If only one context was found and it has a greeting action,
        // ask if the user need any help.
        if (contexts_amount == 1) {
            answers = answers.concat(
                getRandomAnswer(messages.action_help)
            )
        }

        sessions.updateUserSession(session.uid, false, session.last_target, session.last_actions)

    } else if (action === 'action_functions') {

        if (targets.length == 1) {
            answers = answers.concat(
                getRandomAnswer(messages.action_functions[targets[0]])
            )
        } else {
            answers = answers.concat(
                getRandomAnswer(messages.action_functions.general)
            )
        }

    } else if (action === 'action_help') {

        answers = answers.concat(
            getRandomAnswer(messages.action_help)
        )

    } else if (action === 'action_knowledge') {

        if (targets.length > 1 || infos.length > 1) {
            answers = answers.concat(
                getRandomAnswer(messages.action_knowledge.too_much)
            )
        } else if (targets.length == 1) {
            if (infos.length == 1) {
                answers = answers.concat(
                    getRandomAnswer(messages.action_knowledge[targets[0]][infos[0]])
                )
            } else {
                answers = answers.concat(
                    getRandomAnswer(messages.action_knowledge[targets[0]].general)
                )
            }
        } else {
            answers = answers.concat(
                getRandomAnswer(messages.action_knowledge.general)
            )
        }

    } else if (action === 'action_tell_joke') {

        answers = ['I am still working on it!']

    } else {

        // Something went wrong, 
    } 

    return answers
}

module.exports = {
    handleMessage
};