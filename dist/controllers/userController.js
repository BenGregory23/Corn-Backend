"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMovieHandler = exports.addMovieHandler = exports.getUserMovies = exports.removeGenreHandler = exports.addGenreHandler = exports.removeFriendHandler = exports.addFriendHandler = exports.getFriendsHandler = exports.deleteUserHandler = exports.updateUserHandler = exports.createUserHandler = exports.getUserById = exports.getAllUsers = void 0;
const userRepo_1 = require("../repo/userRepo");
async function getAllUsers(req, res) {
    try {
        const users = await (0, userRepo_1.getUsers)();
        res.json(users);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.getAllUsers = getAllUsers;
async function getUserById(req, res) {
    try {
        const user = await (0, userRepo_1.getUser)(req.params.id);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json(user);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.getUserById = getUserById;
async function createUserHandler(req, res) {
    try {
        const user = req.body;
        const id = await (0, userRepo_1.createUser)(user);
        res.status(201);
        res.json({ id });
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.createUserHandler = createUserHandler;
async function updateUserHandler(req, res) {
    try {
        const user = req.body;
        await (0, userRepo_1.updateUser)(req.params.id, user);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.updateUserHandler = updateUserHandler;
async function deleteUserHandler(req, res) {
    try {
        await (0, userRepo_1.deleteUser)(req.params.id);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.deleteUserHandler = deleteUserHandler;
async function getFriendsHandler(req, res) {
    try {
        const friends = await (0, userRepo_1.getFriends)(req.params.id);
        res.json(friends);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.getFriendsHandler = getFriendsHandler;
async function addFriendHandler(req, res) {
    try {
        console.log(req.body);
        const friendEmail = req.body.email;
        const result = await (0, userRepo_1.addFriend)(req.params.id, friendEmail);
        if (result == false) {
            res.status(404).send("Friend not found");
            return;
        }
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.addFriendHandler = addFriendHandler;
async function removeFriendHandler(req, res) {
    try {
        const friendId = req.body.friendId;
        await (0, userRepo_1.removeFriend)(req.params.id, friendId);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.removeFriendHandler = removeFriendHandler;
async function addGenreHandler(req, res) {
    try {
        const genre = req.body.genre;
        await (0, userRepo_1.addGenre)(req.params.id, genre);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.addGenreHandler = addGenreHandler;
async function removeGenreHandler(req, res) {
    try {
        const genre = req.body.genre;
        await (0, userRepo_1.removeGenre)(req.params.id, genre);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.removeGenreHandler = removeGenreHandler;
async function getUserMovies(req, res) {
    try {
        const userId = req.params.id;
        const movies = await (0, userRepo_1.getMoviesFromUser)(userId);
        res.json(movies);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.getUserMovies = getUserMovies;
async function addMovieHandler(req, res) {
    try {
        const result = await (0, userRepo_1.addMovie)(req.params.id, req.body);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.addMovieHandler = addMovieHandler;
async function removeMovieHandler(req, res) {
    try {
        const result = await (0, userRepo_1.removeMovie)(req.params.id, req.body);
        res.sendStatus(200);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.removeMovieHandler = removeMovieHandler;
