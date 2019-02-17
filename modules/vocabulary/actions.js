module.exports = [
    {
        code: 'greetings',
        surfaces: ['hi']
    },
    {
        code: 'functionality',
        surfaces: ['can do', 'to_be purpose'],
        optional: ['target_bot', 'target_chuck_norris']
    },
    {
        code: 'help',
        surfaces: ['help', 'stuck', 'lost', 'what now'],
        optional: ['target_sender', 'target_chuck_norris']
    },
    {
        code: 'knowledge',
        surfaces: ['know about', 'fact', 'tell something', 'tell the', 'tell about', 'what to_be', 'when to_be', 'to_be?'],
        optional: ['target_bot', 'target_chuck_norris', 'target_comedians_club', 'info_age', 'info_height']
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
    }
];