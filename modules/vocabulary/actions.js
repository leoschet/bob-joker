module.exports = [
    {
        code: 'greetings',
        surfaces: ['hi']
    },
    {
        code: 'functionality',
        surfaces: ['can do', 'to_be purpose'],
        optional: ['target_bot', 'target_chuck_norris', 'target_repeat']
    },
    {
        code: 'help',
        surfaces: ['help', 'stuck', 'lost', 'what now']
    },
    {
        code: 'knowledge',
        surfaces: ['know about', 'fact', 'tell me', 'tell something', 'tell the', 'tell about', 'what to_be', 'when to_be', 'to_be?'],
        optional: ['target_bot', 'target_chuck_norris', 'target_comedians_club', 'target_repeat', 'info_age', 'info_height'],
        transform: ['action_tell_joke', 'action_repeat']
    },
    {
        code: 'tell_joke',
        surfaces: ['tell joke'],
        optional: ['action_repeat']
    },
    {
        code: 'repeat',
        surfaces: ['repeat']
    },
    {
        code: 'reset',
        surfaces: ['reset']
    },
    {
        code: 'bye',
        surfaces: ['see you', 'bye', 'tchau']
    }
];