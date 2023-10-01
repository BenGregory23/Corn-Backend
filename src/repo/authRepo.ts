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
        name: user.name,
        email: user.email,
        genres: user.genres,
        friends: user.friends,
        movies: user.movies,
        groups: user.groups,
    };
}

export async function register(user: UserWithPassword): Promise<string> {
    const db = getDB();

    // check if user exists
    const existingUser = await db.collection('users').findOne({email: user.email});
    if(existingUser){
        throw new Error('User already exists');
    }

    const userPassword = user.password;
    const hashedPassword = SHA256(userPassword).toString();
    user.password = hashedPassword;

    // TODO fix this 
    // @ts-ignore
    const result = await db.collection('users').insertOne(user);
    return result.insertedId.toString();
}