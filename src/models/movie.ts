export interface Movie{
    _id: string;
    name: string;
    poster: string;
    id_tmdb: string;
    year: string;
    description: string;
    tag: string; // how the user feels about the movie : "love" or "wants to watch"
}