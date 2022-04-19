const Pool = require('pg').Pool;
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

exports.get_individual_word = (req, res) => {
    const id = req.params.id;

    pool.query(
        'SELECT * FROM words WHERE word = $1',
        [id],
        (error, results) => {
            if (error) {
                throw error;
            }
            if (results.rows.length > 0) {
                res.status(200).json(results.rows);
            } else {
                res.status(404).json({
                    message: 'That word is not in the database.',
                });
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
