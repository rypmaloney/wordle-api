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
