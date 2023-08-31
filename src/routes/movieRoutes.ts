import { getRandomMovies} from "../controllers/movieController";

const router = require("express").Router();

router.get("/movies/random/:id", getRandomMovies);



module.exports = router;