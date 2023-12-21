"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceToken = exports.setDeviceToken = exports.getProfilePicture = exports.setProfilePicture = exports.addUserToGroup = exports.removeGroup = exports.createGroup = exports.getGroups = exports.getMoviesFromUser = exports.removeMovie = exports.addMovie = exports.removeGenre = exports.addGenre = exports.removeFriend = exports.addFriend = exports.addFriendWithUsername = exports.getFriends = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUser = exports.getUsers = void 0;
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
        groups: user.groups,
        profilePicture: user.profilePicture
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
        groups: user.groups,
        profilePicture: user.profilePicture
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
// return a simple array 
async function getFriends(id) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(id) });
    if (!result) {
        return [];
    }
    const friendIds = result.friends || [];
    // for each friend id, find the friend and return the friend's name and email and id 
    const friends = await db.collection('users').find({ _id: { $in: friendIds } }).toArray();
    if (!friends) {
        return [];
    }
    return friends.map((friend) => ({
        _id: friend._id.toString(),
        username: friend.username,
        email: friend.email,
        profilePicture: friend.profilePicture
    }));
}
exports.getFriends = getFriends;
async function addFriendWithUsername(userId, friendUsername) {
    const db = (0, db_1.getDB)();
    // find friend by username
    const friend = await db.collection('users').findOne({ username: friendUsername });
    if (!friend) {
        return { success: false, error: 'User not found' };
    }
    // Check if the user is already friends with this friend
    const isFriend = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId), friends: new mongodb_1.ObjectId(friend._id) });
    if (isFriend) {
        return { success: false, error: 'Already friends' };
    }
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { friends: new mongodb_1.ObjectId(friend._id) } });
    // Also add the user to the friend's friends list
    await db.collection('users').updateOne({ _id: friend._id }, { $push: { friends: new mongodb_1.ObjectId(userId) } });
    return { success: result.modifiedCount > 0 };
}
exports.addFriendWithUsername = addFriendWithUsername;
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
    // check if movie already exists in user's collection
    const existingMovie = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId), movies: movie });
    if (existingMovie) {
        return false;
    }
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { movies: movie } });
    return result.modifiedCount > 0;
}
exports.addMovie = addMovie;
async function removeMovie(userId, movie) {
    const db = (0, db_1.getDB)();
    // Use the movie ID directly without converting to ObjectId
    const movieId = movie._id;
    // Attempt to remove the movie from the user's collection
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { movies: { _id: movieId } } });
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
async function getGroups(userId) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
    if (!result) {
        return [];
    }
    const groups = result.groups || [];
    return groups;
}
exports.getGroups = getGroups;
async function createGroup(userId, group) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { groups: group } });
    return result.modifiedCount > 0;
}
exports.createGroup = createGroup;
async function removeGroup(userId, groupId) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $pull: { groups: groupId } });
    return result.modifiedCount > 0;
}
exports.removeGroup = removeGroup;
async function addUserToGroup(userId, groupId) {
    const db = (0, db_1.getDB)();
    // Checking if the user is already in the group
    const isMember = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId), groups: new mongodb_1.ObjectId(groupId) });
    if (isMember) {
        return false;
    }
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $push: { groups: groupId } });
    return result.modifiedCount > 0;
}
exports.addUserToGroup = addUserToGroup;
// Set profile picture string for a user 
async function setProfilePicture(userId, picture) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: { profilePicture: picture } });
    return {
        success: result.modifiedCount > 0,
        error: result.modifiedCount > 0 ? undefined : 'Failed to set profile picture',
        message: result.modifiedCount > 0 ? 'Profile picture set' : undefined
    };
}
exports.setProfilePicture = setProfilePicture;
async function getProfilePicture(userId) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
    if (!result) {
        return '';
    }
    const picture = result.profilePicture || '';
    return picture;
}
exports.getProfilePicture = getProfilePicture;
// set device token for a user
async function setDeviceToken(userId, token) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').updateOne({ _id: new mongodb_1.ObjectId(userId) }, { $set: { deviceToken: token } });
    return {
        success: result.modifiedCount > 0,
        error: result.modifiedCount > 0 ? undefined : 'Failed to set device token',
        message: result.modifiedCount > 0 ? 'Device token set' : undefined
    };
}
exports.setDeviceToken = setDeviceToken;
async function getDeviceToken(userId) {
    const db = (0, db_1.getDB)();
    const result = await db.collection('users').findOne({ _id: new mongodb_1.ObjectId(userId) });
    if (!result) {
        return {
            success: false,
            error: 'No user found',
            message: undefined
        };
    }
    if (!result.deviceToken) {
        return {
            success: false,
            error: 'No device token found',
            message: undefined
        };
    }
    const token = result.deviceToken;
    return {
        success: true,
        error: undefined,
        message: "Device token found",
        data: token
    };
}
exports.getDeviceToken = getDeviceToken;
