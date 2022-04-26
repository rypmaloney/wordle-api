const axios = require('axios');

exports.fetchWord = async (guess) => {
    let config = {
        headers: {
            Accept: 'application/json',
            'x-rapidapi-host': process.env.WORDS_HOST,
            'x-rapidapi-key': process.env.KEY,
        },
    };

    try {
        let response = await axios.get(
            `https://wordsapiv1.p.rapidapi.com/words/${guess}/definitions`,
            config
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
