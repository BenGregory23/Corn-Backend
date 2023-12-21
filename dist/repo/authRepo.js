"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const db_1 = require("../db");
const crypto_js_1 = require("crypto-js");
async function login(email, password) {
    const db = (0, db_1.getDB)();
    const user = await db.collection('users').findOne({ email: email, password: (0, crypto_js_1.SHA256)(password).toString() });
    if (!user) {
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
exports.login = login;
// return id or return error
async function register(user) {
    const db = (0, db_1.getDB)();
    // check if user  with same email exists
    const existingUser = await db.collection('users').findOne({ email: user.email });
    // check if user with same username exists
    const existingUsername = await db.collection('users').findOne({ username: user.name });
    if (existingUsername) {
        return { id: '', error: 'Username already exists, use a different username or try log to in.' };
    }
    if (existingUser) {
        return { id: '', error: 'User already exists, use a different email or try log to in.' };
    }
    const userPassword = user.password;
    const hashedPassword = (0, crypto_js_1.SHA256)(userPassword).toString();
    user.password = hashedPassword;
    // TODO fix this 
    // @ts-ignore
    const result = await db.collection('users').insertOne(user);
    return { id: result.insertedId.toString(), error: undefined };
}
exports.register = register;
