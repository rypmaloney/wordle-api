# Wordle API 

This is an Express API connected to a Postgres database to serve my [Wordle Unlimited](https://github.com/rypmaloney/wordle-unlimited) frontend. The main motivation of this API is threefold.
1. Create a DB that has many commonly guessed words to quickly query without having to always use an external service. 
2. Populate a 5 letter word game list that has reasonable words and is dynamically updated based on user guessses.
3. Track as much information as possible related to games played to create a robust and useable Postgres db I can query. 


## Routes
`GET - /words/`
Get all words in the database.

`POST - /words/<GUESS>/`
Post a word to check if it is in fact a word. First we check if it's in my DB, if it isn't we query a free dictionary API. If the dictionary API has it in their DB, I add it to my DB and send the info to the frontend. If the dictionary API doesn't have the word, we assume it isn't in common usage and send that it is not a word. 
If the word is already in the DB, it'll update an incrementer that keeps track of how often words are guessed. 
This will also populate a table that keeps track of every guess instance, who made it, and what game it is a part of.

`POST - /words/<WORD>/add/`
Easy route to add a word to the DB. Just specify a word in the path, and the backend will take care of the rest. 

`GET - /lists/<WORD_LENGTH>`
Get a list of words in the database filtered by, which would then be shuffled on the frontend and stored in local storage to set up a users game. 

`POST - /game/`
At the end of the game, this posts all of the data about the game to the DB, including, correct/incorrect guesses, game ID, user, and the word. 



