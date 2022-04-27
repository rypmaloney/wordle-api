const fetchWord = require('./fetchWord').fetchWord;
const { pool } = require('./config');

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
                const dictionaryResponse = await fetchWord(id);

                if (dictionaryResponse) {
                    //its a real word, add to DB and send response
                    let definition = 'ERROR: No definition in DB';
                    let pos = false;
                    if (dictionaryResponse.definitions.length > 0) {
                        definition =
                            dictionaryResponse.definitions[0].definition;
                        pos = dictionaryResponse.definitions[0].partOfSpeech;
                    }

                    pool.query(
                        'INSERT INTO words (word, definition, length, pos) VALUES ($1, $2, $3, $4)',
                        [id, definition, dictionaryResponse.word.length, pos],
                        (error, results) => {
                            if (error) {
                                throw error;
                            }
                            res.status(201).json({
                                word: id,
                                definition: definition,
                                length: id.length,
                                pos: pos,
                            });
                        }
                    );
                } else {
                    //Not a word in the API
                    console.log('not a word');
                    res.status(404).json({ message: `${id} is not a word` });
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

exports.get_list = (req, res) => {
    const id = req.params.id;
    pool.query(
        'SELECT * FROM words WHERE LENGTH(word) = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );
};

exports.get_six_letter_words = (req, res) => {};
