import { User, UserWithPassword } from "../models/user";
import { getDB } from "../db";
import { SHA256 } from "crypto-js";


export async function login(email:string, password:string){
    const db = getDB();
    const user = await db.collection('users').findOne({email: email, password: SHA256(password).toString()});
    if(!user){
        return null;
    }
    return {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        genres: user.genres,
        friends: user.friends,
        movies: user.movies,
        groups: user.groups,
        profilePicture: user.profilePicture
    };
}

// return id or return error

export async function register(user: UserWithPassword): Promise<{id: string, error?: string}>{
    const db = getDB();

    // check if user  with same email exists
    const existingUser = await db.collection('users').findOne({email: user.email});

    // check if user with same username exists
    const existingUsername = await db.collection('users').findOne({username: user.name});

    if(existingUsername){
        return {id: '', error: 'Username already exists, use a different username or try log to in.'};
    }

    if(existingUser){
        return {id: '', error: 'User already exists, use a different email or try log to in.'};
    }

    const userPassword = user.password;
    const hashedPassword = SHA256(userPassword).toString();
    user.password = hashedPassword;

    // TODO fix this 
    // @ts-ignore
    const result = await db.collection('users').insertOne(user);
    return {id: result.insertedId.toString(), error: undefined};
}