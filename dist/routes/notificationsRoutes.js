"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notificationsController_1 = require("../controllers/notificationsController");
const router = require("express").Router();
router.post("/notifications", notificationsController_1.sendNotification);
module.exports = router;
