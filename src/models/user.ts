export interface User {
    _id: string | null;
    name: string;
    email: string;
    genres: string[];
    friends: string[];
    groups: string[];
    movies: object[];
}

export interface UserWithPassword extends User {
    password: string;
}