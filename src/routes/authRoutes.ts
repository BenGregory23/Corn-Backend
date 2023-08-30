import { registerUser, loginUser } from "../controllers/authController";

const router = require("express").Router();

router.post("/register", registerUser);
router.get("/login", loginUser);



module.exports = router;

