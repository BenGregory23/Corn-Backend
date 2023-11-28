"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomMovies = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const userRepo_1 = require("../repo/userRepo");
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
/*
export const getRandomMovies = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    let movies = [] as Movie[];

    while(movies.length < 60) {
      let randomPage = Math.floor(Math.random() * 500) + 1;
     
     //const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${randomPage}`;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${randomPage}&include_adult=false&include_video=false&language=en-US&vote_average.gte=3&vote_count.gte=3000`
      const response = await fetch(url);
      const data = await response.json();

      

      // merge the results into the movies array
      movies = [
        ...movies,
        ...data.results.map((result: any) => ({
          // create a mondodb id
          _id: new ObjectId(),
          id_tmdb: result.id,
          title: result.title,
          poster: result.poster_path,
          release_date: result.release_date ? new Date(result.release_date).getFullYear() : null, // Extract year
          overview: result.overview,
          adult: result.adult,
          backdrop_path: result.backdrop_path,
          genre_ids: result.genre_ids,
          original_language: result.original_language,
          original_title: result.original_title,
          popularity: result.popularity,
          video: result.video,
          vote_average: result.vote_average,
          vote_count: result.vote_count,
        })),
      ];
    }

    // remove movies with no poster
    movies = movies.filter(movie => movie.poster !== null);

  

    // check if the user already has the movie in their list
    // if they do, remove it from the list

    const userMovies = await getMoviesFromUser(userId) as any[];

    movies = movies.filter(movie => {
      let found = false;
      userMovies.forEach(userMovie => {
        // @ts-ignore
        if (userMovie.id_tmdb === movie.id_tmdb) {
          found = true;
        }
      });
      return !found;
    });

   
    res.json(movies);
  } catch (error) {
    res.status(500).send(error);
  }
};
*/
/*
export const getRandomMovies = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userMovies = await getMoviesFromUser(userId) as any[];

    const userMovieIds = new Set(userMovies.map(movie => movie.id_tmdb));

    const promises = Array.from({ length: 60 }, () => {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${randomPage}&include_adult=false&include_video=false&language=en-US&vote_average.gte=3&vote_count.gte=3000`;
      return fetch(url).then(response => response.json());
    });

    const responses = await Promise.all(promises);
    let movies = responses.flatMap(data => data.results.map((result: any) => ({
      _id: new ObjectId(),
      id_tmdb: result.id,
      title: result.title,
      poster: result.poster_path,
      release_date: result.release_date ? new Date(result.release_date).getFullYear() : null,
      overview: result.overview,
      adult: result.adult,
      backdrop_path: result.backdrop_path,
      genre_ids: result.genre_ids,
      original_language: result.original_language,
      original_title: result.original_title,
      popularity: result.popularity,
      video: result.video,
      vote_average: result.vote_average,
      vote_count: result.vote_count,
    })));

    movies = movies.filter(movie => movie.poster !== null && !userMovieIds.has(movie.id_tmdb));

    res.json(movies);
  } catch (error) {
    res.status(500).send(error);
  }
};
*/
const getRandomMovies = async (req, res) => {
    try {
        const userId = req.params.id;
        const userMovies = await (0, userRepo_1.getMoviesFromUser)(userId);
        const userMovieIds = new Set(userMovies.map(movie => movie.id_tmdb));
        const movies = [];
        const responses = new Set();
        while (movies.length < 60 && responses.size < 60) {
            const randomPage = Math.floor(Math.random() * 500) + 1;
            const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${randomPage}&include_adult=false&include_video=false&language=en-US&vote_average.gte=3&vote_count.gte=3000`;
            const response = await fetch(url);
            const data = await response.json();
            // Filter out duplicates based on id_tmdb
            const pageMovies = data.results.map((result) => ({
                _id: new mongodb_1.ObjectId(),
                id_tmdb: result.id,
                title: result.title,
                poster: result.poster_path,
                release_date: result.release_date ? new Date(result.release_date).getFullYear() : null,
                overview: result.overview,
                adult: result.adult,
                backdrop_path: result.backdrop_path,
                genre_ids: result.genre_ids,
                original_language: result.original_language,
                original_title: result.original_title,
                popularity: result.popularity,
                video: result.video,
                vote_average: result.vote_average,
                vote_count: result.vote_count,
                // @ts-ignore
            })).filter(movie => !userMovieIds.has(movie.id_tmdb));
            // Only accumulate unique movies
            movies.push(...pageMovies);
            // Update responses set
            responses.add(JSON.stringify(data));
        }
        res.json(movies.slice(0, 60)); // Return at most 60 movies
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getRandomMovies = getRandomMovies;
