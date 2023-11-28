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

export const getRandomMovies = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    let movies = [] as Movie[];

    for (let i = 0; i < 3; i++) {
      let randomPage = 0;
      while (randomPage === 0) {
        randomPage = Math.floor(Math.random() * 500);
      }
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
