export interface User {
    _id: string | null;
    name: string;
    email: string;
    password: string;
    genres: string[];
    friends: string[];
    movies: object[];
}