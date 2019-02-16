'use strict';

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
function _generateRandomInt(min_value, max_value) {

    // Make sure received values are integers
    min_value = Math.ceil(min_value);
    max_value = Math.floor(max_value);

    // Return random integer in the passed range
    return Math.floor(Math.random() * (max_value - min_value + 1)) + min_value;
}

function getRandomAnswer(options) {

    // Receive an array with possible messages and randomly return one
    return options[
        _generateRandomInt(0, options.length - 1)
    ];
}

module.exports = {
    getRandomAnswer
};