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
        async (error, returnedResults) => {
            if (error) {
                throw error;
            }
            if (returnedResults.rows.length > 0) {
                //the word is in the db
                //increment referenced count
                const referencedCount = returnedResults.rows[0].referencedcount;
                let incrementedCount = referencedCount + 1;
                const word = req.params.id;

                pool.query(
                    'UPDATE words SET referencedCount = $1 WHERE word = $2',
                    [incrementedCount, word],
                    (error, results) => {
                        if (error) {
                            throw error;
                        }

                        if (returnedResults.rows[0].isword == true) {
                            //word is a word, send info
                            res.status(200).json(returnedResults.rows);
                        } else {
                            //the word is not a word
                            res.status(404).json({
                                message: `${id} is not a word`,
                            });
                        }
                    }
                );
            } else {
                //word is not in database or is not a word, query API
                const dictionaryResponse = await fetchWord(id);

                let definition =
                    'ERROR: No definition in DB. This is likely not a word.';
                let pos = false;
                let isWord = false;
                let rc = 0;
                if (dictionaryResponse) {
                    //its a real word, add to DB
                    isWord = true;
                    definition =
                        dictionaryResponse[0].meanings[0].definitions[0]
                            .definition;
                    pos = dictionaryResponse[0].meanings[0].partOfSpeech;
                }

                pool.query(
                    'INSERT INTO words (word, definition, length, pos, referencedCount, isWord) VALUES ($1, $2, $3, $4, $5, $6)',
                    [id, definition, id.length, pos, rc, isWord],
                    (error, results) => {
                        if (error) {
                            throw error;
                        }
                        if (isWord) {
                            res.status(201).json({
                                word: id,
                                definition: definition,
                                length: id.length,
                                pos: pos,
                            });
                        } else {
                            console.log('not a word');
                            res.status(404).json({
                                message: `${id} is not a word`,
                            });
                        }
                    }
                );
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
        'SELECT * FROM words WHERE LENGTH(word) = $1 AND isword = true',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).json(results.rows);
        }
    );
};
