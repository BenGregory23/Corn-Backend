"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const movieController_1 = require("../controllers/movieController");
const router = require("express").Router();
router.get("/movies/random:id", movieController_1.getRandomMovies);
module.exports = router;
