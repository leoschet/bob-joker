'use strict';

const user_session = {};

function _createUserSession(uid) {

    // Initialize user session with default parameters' values
    user_session[uid] = {
        uid: uid,
        first_time: true,
        last_target: undefined,
        last_action: undefined,
        jokes_amount: 0,
        reset_amount: 0
    };

    return user_session[uid]
}

function getUserSession(uid) {

    if (uid in user_session) {
        // Retrieve already created session for current user
        return user_session[uid]
    }

    // New user arrived
    return _createUserSession(uid)
}

function setProperty(uid, properties) {

    // Update session variables
    for (let property in properties) {
        user_session[uid][property] = properties[property]
    }
}

module.exports = {
    getUserSession,
    setProperty
};