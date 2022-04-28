const axios = require('axios');

exports.fetchWord = async (guess) => {
    let config = {
        headers: {
            Accept: 'application/json',
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
