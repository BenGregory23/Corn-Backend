"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomMovies = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userRepo_1 = require("../repo/userRepo");
dotenv_1.default.config();
const getRandomMovies = async (req, res) => {
    try {
        const userId = req.params.id;
        let movies = [];
        for (let i = 0; i < 3; i++) {
            let randomPage = 0;
            while (randomPage === 0) {
                randomPage = Math.floor(Math.random() * 500);
            }
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${randomPage}`;
            const response = await fetch(url);
            const data = await response.json();
            // merge the results into the movies array
            movies = [...movies, ...data.results];
        }
        // check if the user already has the movie in their list
        // if they do, remove it from the list
        const userMovies = await (0, userRepo_1.getMoviesFromUser)(userId);
        movies = movies.filter(movie => {
            let found = false;
            userMovies.forEach(userMovie => {
                // @ts-ignore
                if (userMovie.id_tmdb === movie.id) {
                    found = true;
                }
            });
            return !found;
        });
        res.json(movies);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getRandomMovies = getRandomMovies;
