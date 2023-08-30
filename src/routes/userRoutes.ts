import { getAllUsers, getUserById, createUserHandler, updateUserHandler, deleteUserHandler, addMovieHandler, removeMovieHandler, addFriendHandler, removeFriendHandler, getFriendsHandler, getUserMovies} from "../controllers/userController";

const router = require("express").Router();

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUserHandler);
router.put("/users/:id", updateUserHandler);
router.delete("/users/:id", deleteUserHandler);
router.get("/users/:id/movies", getUserMovies);
router.post("/users/:id/movies", addMovieHandler);
router.delete("/users/:id/movies", removeMovieHandler);
router.get("/users/:id/friends", getFriendsHandler);
router.post("/users/:id/friends", addFriendHandler);
router.delete("/users/:id/friends", removeFriendHandler);

module.exports = router;

