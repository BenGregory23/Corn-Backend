"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const authRepo_1 = require("../repo/authRepo");
// register
async function registerUser(req, res) {
    try {
        const id = await (0, authRepo_1.register)(req.body);
        res.status(201);
        res.json({ id });
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.registerUser = registerUser;
// login
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await (0, authRepo_1.login)(email, password);
        if (!user) {
            res.status(401);
            res.send('Invalid credentials');
            return;
        }
        res.json(user);
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.loginUser = loginUser;
