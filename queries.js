const { json } = require('express');

const Pool = require('pg').Pool;
const fetchWord = require('./fetchWord').fetchWord;
const pool = new Pool({
    user: process.env.USER,
    host: 'localhost',
    database: process.env.DB,
    password: process.env.PASSWORD,
    port: 5432,
});

exports.get_all_words = (req, res) => {
    pool.query('SELECT * FROM words ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows);
    });
};

exports.get_individual_word = async (req, res) => {
    const id = req.params.id;

    pool.query(
        'SELECT * FROM words WHERE word = $1',
        [id],
        async (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length > 0) {
                //word is in database, send info
                res.status(200).json(results.rows);
            } else {
                //word is not in database, query API
                const dictionary_response = await fetchWord(id);

                if (dictionary_response) {
                    //its a real word, add to DB and send response
                    pool.query(
                        'INSERT INTO words (word, definition, length, pos) VALUES ($1, $2, $3, $4)',
                        [
                            dictionary_response.word,
                            dictionary_response.definitions[0].definition,
                            dictionary_response.word.length,
                            dictionary_response.definitions[0].partOfSpeech,
                        ],
                        (error, results) => {
                            if (error) {
                                throw error;
                            }
                            res.status(201).json(dictionary_response);
                        }
                    );
                } else {
                    //Not a word in the API
                    console.log('not a word');
                    res.json({ message: 'not a word' });
                }
            }
        }
    );
};

exports.add_word = (req, res) => {
    const { word, definition, length, pos } = req.body;

    pool.query(
        'INSERT INTO words (word, definition, length, pos) VALUES ($1, $2, $3, $4)',
        [word, definition, length, pos],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(201).send(`Word added`);
        }
    );
};

exports.check_word = async (req, res) => {
    const word = req.params.id;

    const dictionary_response = await fetchWord(word);

    console.log(dictionary_response);

    if (dictionary_response) {
        res.json(dictionary_response);
    } else {
        console.log('not a word');
        res.json({ message: 'not a word' });
    }
};

const add_word_to_db = async (word) => {};
