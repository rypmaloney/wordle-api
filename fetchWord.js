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
            `https://api.dictionaryapi.dev/api/v2/entries/en/${guess}/`,
            config
        );
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
