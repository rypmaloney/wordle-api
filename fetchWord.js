const axios = require('axios');

const fetchWord = async (guess) => {
    let config = {
        headers: {
            Accept: 'application/json',
            'x-rapidapi-host': process.env.HOST,
            'x-rapidapi-key': process.env.KEY,
        },
    };

    try {
        return await axios.get(
            `https://wordsapiv1.p.rapidapi.com/words/${guess}/definitions`,
            config
        );
    } catch (error) {
        console.error(error);
    }
};

const insert_word_db = async () => {
    const word = await fetchWord();

    if (word) {
        console.log(`${word.word} inserted into DB`);
    }
};
