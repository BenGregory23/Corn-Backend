"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesFromUser = exports.removeMovie = exports.addMovie = exports.removeGenre = exports.addGenre = exports.removeFriend = exports.addFriend = exports.getFriends = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
const db_1 = require("../db");
const mongodb_1 = require("mongodb");
const crypto_js_1 = require("crypto-js");
async function getUsers() {
    const db = (0, db_1.getDB)();
    // loop through the documents and map them to the User type
    const users = await db.collection('users').find({}).toArray();
    if (!users) {
        throw new Error('No users found');
    }
    return users.map((user) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        genres: user.genres,
        friends: user.friends,
        movies: user.movies,
    }));
}
exports.getUsers = getUsers;
async function getUser(id) {
    const db = (0, db_1.getDB)();
    const user = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!user) {
        return null;
    }
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        genres: user.genres,
        friends: user.friends,
        movies: user.movies,
    };
}
exports.getUser = getUser;
async function createUser(user) {
    const db = (0, db_1.getDB)();
    const userPassword = user.password;
    const hashedPassword = (0, crypto_js_1.SHA256)(userPassword).toString();
    user.password = hashedPassword;
    // TODO fix this 
    // @ts-ignore
    const result = await db.collection('users').insertOne(user);
    return result.insertedId.toString();
}
exports.createUser = createUser;
async function updateUser(id, user) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: user });
    return result.modifiedCount > 0;
}
exports.updateUser = updateUser;
async function deleteUser(id) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').deleteOne({ _id: new mongodb_1.ObjectId(id) });
    return result.deletedCount > 0;
}
exports.deleteUser = deleteUser;
async function getFriends(id) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!result) {
        return [];
    }
    const friendIds = result.friends || [];
    const friends = await db.collection('users').find({ _id: { $in: friendIds } }).toArray();
    return friends.map((friend) => ({
        _id: friend._id.toString(),
        name: friend.name,
        email: friend.email,
        password: friend.password,
        genres: friend.genres,
        friends: friend.friends,
        movies: friend.movies,
    }));
}
exports.getFriends = getFriends;
async function addFriend(userId, friendEmail) {
    const db = (0, db_1.getDB)();
    // find friend by email
    const friend = await db.collection('users').findOne({ email: friendEmail });
    if (!friend) {
        return false;
    }
    // Check if the user is already friends with this friend
    const isFriend = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId), friends: new mongodb_1.ObjectId(friend._id) });
    if (isFriend) {
        return false;
    }
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { friends: new mongodb_1.ObjectId(friend._id) } });
    // Also add the user to the friend's friends list
    await db.collection('users').updateOne({ _id: friend._id }, { $push: { friends: new mongodb_1.ObjectId(userId) } });
    return result.modifiedCount > 0;
}
exports.addFriend = addFriend;
async function removeFriend(userId, friendId) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { friends: friendId } });
    return result.modifiedCount > 0;
}
exports.removeFriend = removeFriend;
async function addGenre(userId, genre) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { genres: genre } });
    return result.modifiedCount > 0;
}
exports.addGenre = addGenre;
async function removeGenre(userId, genre) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { genres: genre } });
    return result.modifiedCount > 0;
}
exports.removeGenre = removeGenre;
async function addMovie(userId, movie) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { movies: movie } });
    return result.modifiedCount > 0;
}
exports.addMovie = addMovie;
async function removeMovie(userId, movie) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { movies: movie } });
    return result.modifiedCount > 0;
}
exports.removeMovie = removeMovie;
async function getMoviesFromUser(userId) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
    if (!result) {
        return [];
    }
    const movies = result.movies || [];
    return movies;
}
exports.getMoviesFromUser = getMoviesFromUser;
