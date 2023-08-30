"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = require("../controllers/authController");
const router = require("express").Router();
router.post("/register", authController_1.registerUser);
router.get("/login", authController_1.loginUser);
module.exports = router;
