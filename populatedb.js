const fs = require('fs');
let rawWords = fs.readFileSync('./lists/goodWords.json');
let words = JSON.parse(rawWords);
require('dotenv').config();
const { pool } = require('./config');

const addWordToDB = (word, definition, length, pos) => {
    console.log('Running');
    pool.query(
        'INSERT INTO words (word, definition, length, pos) VALUES ($1, $2, $3, $4)',
        [word, definition, length, pos],
        (error, results) => {
            if (error) {
                console.log(error);
                throw error;
            }
        }
    );
};

function runPopulate() {
    for (let i = 0; i < words.length; i++) {
        addWordToDB(
            words[i].word,
            words[i].definitions[0].definition,
            5,
            words[i].definitions[0].partOfSpeech
        );
        console.log(`${words[i].word} added`);
    }
}

runPopulate();
