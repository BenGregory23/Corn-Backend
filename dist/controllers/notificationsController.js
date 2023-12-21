"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const apnConfig_1 = __importDefault(require("../notifications/apn/apnConfig"));
const node_apn_1 = __importDefault(require("@parse/node-apn"));
const userRepo_1 = require("../repo/userRepo");
dotenv_1.default.config();
// Todo function to send notification to user
async function sendNotification(req, res) {
    let senderId = req.body.senderId;
    let recipientId = req.body.recipientId;
    let message = req.body.message;
    let notification = new node_apn_1.default.Notification({
        alert: message,
        sound: "default",
        badge: 1,
        topic: "com.bengregory.Corn",
        payload: {
            "senderId": senderId,
            "recipientId": recipientId
        },
        pushType: "alert"
    });
    let response = await (0, userRepo_1.getDeviceToken)(recipientId);
    if (response.error) {
        res.status(500).send(response.error);
        return;
    }
    let deviceToken = response.data;
    if (!deviceToken) {
        res.status(404).send("No device token found");
        return;
    }
    apnConfig_1.default.send(notification, deviceToken).then((response) => {
        // Handle response
        console.log(response);
        res.send(response);
    }).catch(error => {
        // Handle error
        console.log(error);
        res.status(500).send(error);
    });
}
exports.sendNotification = sendNotification;
