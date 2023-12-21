import { sendNotification } from "../controllers/notificationsController";


const router = require("express").Router();

router.post("/notifications", sendNotification);



module.exports = router;