export interface User {
    _id: string | null;
    name: string;
    email: string;
    genres: string[];
    friends: string[];
    groups: string[];
    movies: object[];
    profilePicture: string | null;
}

export interface UserWithPassword extends User {
    password: string;
}

export interface UserWithNotifications extends User {
    notifications: object[];
}

export interface UserWithDeviceToken extends UserWithNotifications {
    deviceToken: string;
}

