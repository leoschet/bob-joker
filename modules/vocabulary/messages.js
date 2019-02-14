module.exports = {
    action_greetings: {
        first_time: [
            ['Hey, I\'m bob, the best comedian you will ever see! :)'],
            ['Hello, my name is bob and I know every joke there is about Chuck Norris!']
        ],
        next_times: [
            ['Oh, hey!'],
            ['Hi'],
        ]
    },
    action_functions: {
        general: [
            ['Be specific, I do not have all day. Rephrase and ask what I or Chuck Norris can do!'],
            ['I understand you want to know what \'someone\' can do... Please rephrase it specifying who is this \'someone\'']
        ],
        target_bot: [
            ['Well, I can tell you jokes about Chuck Norris, some curiosities about him or me and most importantly I can tell when is the next show at the Comedians Club!'],
            [
                'Hmm, that\'s easy, I can do everything! I\'m like Skynet! And if you don\'t come to the Comedians Club tonight, humanity will die!',
                'Hahaha didn\'t I tell you? I\'am a comedian!', 'Come on, ask me to tell you a joke!'
            ],
            [
                'Try me, ask me something about me or about Chuck Norris! I can also tell a joke if you want to.',
                'Oh, I know when is the next show at the Comedians Club as well!'
            ]
        ],
        target_chuck_norris: [
            ['I am sorry to say, but he can do nothing... He don\'t even exist!', 'I mean, if he did, he would smash my head into the keyboarDNJKBHVDadsgRYTFAbvtcuio', 'Ouch... Ok he is a god'],
            ['I\'m not sure, last time I checked he could do any thing. But I still have some doubts']
        ]
    },
    action_help: {
        target_bot: [
            ['Are you stuck? You can always ask me for a joke, a curiosity or when is the next show at the best comedy house in town: Comedians Club'],
            [
                'Here is the deal, I can tell you the second best jokes ever',
                'Second best because the best you\'re only going to hear at the Comedians Club!',
                'I also know some curiosities about me and my dad (Chuck Norris)'
            ]
        ]
    },
    action_knowledge: {
        general: [
            ['Hmm, I am a fraud, to be honest I only know my and Chuck Norris\' age and height...', 'Besides that, I know when is the next show at the Comedians Club'],
            ['I did not get it... I am only allowed to say my and Chuck\'s age and height...', 'Also I know when is the next show at the Comedians Club'],
        ],
        too_much: [
            ['Please, go easy on me, ask about one person and information at a time!']
        ],
        target_bot: {
            general: [
                ['Too broad, ask for my age or height and I will tell you!'],
                ['Hmm, that is hard! try something easy, ask for my age o height.']
            ],
            info_age: [
                ['I stopped counting at the age of 97...'],
                ['Belive me, I do not remember!!'],
                ['People say I am 19 years old'],
            ],
            info_height: [
                ['Much taller than Chuck Norris. That is all I am going to say.'],
                ['Ok, I am more than 50 meters tall.'],
                ['My height in meters is: very tall'],
                ['Next question...']
            ]
        },
        target_chuck_norris: {
            general: [
                ['Too broad, ask for his age or height and I will tell you!'],
                ['Hmm, that is hard! try something easy, ask for his age o height.']
            ],
            info_age: [
                ['He is exactly 78!'],
                ['Old, very old...']
            ],
            info_height: [
                ['He is really short compared to me, only 1.78m!!'],
                ['Easy one, just 1.78 meters.']
            ]
        }
    },
    action_tell_joke: {
        limit: [
            ['Well buddy, I cannot tell you more jokes today... If you still want more you can go to the Comedians Club tonight!'],
            ['Ok, enough for today, come back tomorrow and I will tell more jokes.', 'If you want more you should go to the Comedians Club! tonight'],
        ]
    }
}