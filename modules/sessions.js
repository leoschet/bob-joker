'use strict'

let user_session = {}

function _createUserSession(uid) {
    return user_session[uid] = {
        uid: uid,
        first_time: true,
        last_target: undefined,
        last_action: undefined
    }
}

function getUserSession(uid) {
if (uid in user_session) {
        return user_session[uid]
    }

    return _createUserSession(uid)
}

function updateUserSession(uid, first_time, last_target, last_action) {

    // Update session variables
    user_session[uid].first_time = first_time
    user_session[uid].last_target = last_target
    user_session[uid].last_action = last_action
}

module.exports = {
    getUserSession,
    updateUserSession
};