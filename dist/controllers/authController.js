"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const authRepo_1 = require("../repo/authRepo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
        const expiresIn = "7d";
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
        res.json({ user, token });
    }
    catch (err) {
        res.status(500);
        res.send(err.message);
    }
}
exports.loginUser = loginUser;
