import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getMoviesFromUser } from '../repo/userRepo';
import { ObjectId } from 'mongodb';

dotenv.config();

export interface Movie {
  id: string;
  id_tmdb: number;
  title: string;
  poster: string;
  release_date: number; // Change the type to number
  overview: string;
  // Additional properties from the API response
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
  vote_average: number;
  vote_count: number;
}



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
export const getRandomMovies = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const userMovies = await getMoviesFromUser(userId) as any[];
    const userMovieIds = new Set(userMovies.map(movie => movie.id_tmdb));

    const movies = [];
    const responses = new Set();

    while (movies.length < 60 && responses.size < 60) {
      const randomPage = Math.floor(Math.random() * 500) + 1;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${randomPage}&include_adult=false&include_video=false&language=en-US&vote_average.gte=3&vote_count.gte=3000`;
      const response = await fetch(url);
      const data = await response.json();

      // Filter out duplicates based on id_tmdb
      const pageMovies = data.results.map((result: any) => ({
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
        // @ts-ignore
      })).filter(movie => !userMovieIds.has(movie.id_tmdb));

      // Only accumulate unique movies
      movies.push(...pageMovies);

      // Update responses set
      responses.add(JSON.stringify(data));
    }

    res.json(movies.slice(0, 60)); // Return at most 60 movies
  } catch (error) {
    res.status(500).send(error);
  }
};
