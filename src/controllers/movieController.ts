import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { getMoviesFromUser } from '../repo/userRepo';

dotenv.config();

export interface Movie {
  id_tmdb: number;
  name: string;
  poster_path: string;
}

export const getRandomMovies = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    let movies = [];

    for(let i = 0; i < 3; i++){
      let randomPage = 0;
      while(randomPage === 0){
        randomPage = Math.floor(Math.random() * 500);
      }
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&page=${10}`;

      const response = await fetch(url);
      const data = await response.json();
      
      movies.push(data.results);
    }

    // check if the user already has the movie in their list
    // if they do, remove it from the list

   const userMovies = await getMoviesFromUser(userId) as Movie[];
   
    movies = movies.filter(movie => {
      let found = false;
      userMovies.forEach(userMovie => {
        if(userMovie.id_tmdb === movie.id){
          found = true;
        }
      });
      return !found;
    }
    );
    res.json(movies);
  } catch (error) {
    res.status(500).send(error);
  }
};



