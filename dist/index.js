"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const authMiddleware_1 = require("./middleware/authMiddleware");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
(0, db_1.connectDB)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.get('/', (req, res) => {
    res.send('Hello, TypeScript!');
});
app.use('/api', require('./routes/authRoutes'));
app.use('/api', authMiddleware_1.authMiddleware, require('./routes/userRoutes'));
app.use('/api', authMiddleware_1.authMiddleware, require('./routes/movieRoutes'));
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
