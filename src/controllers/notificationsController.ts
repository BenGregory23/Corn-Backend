import dotenv from 'dotenv';
import apnProvider from '../notifications/apn/apnConfig';
import apn from '@parse/node-apn';
import {Request, Response} from 'express';
import { getDeviceToken } from '../repo/userRepo';

dotenv.config();

// Todo function to send notification to user
export async function sendNotification(req: Request, res: Response) {
   
    let senderId = req.body.senderId;
    let recipientId = req.body.recipientId;
    let message = req.body.message;
    let notificationType = req.body.notificationType;

    let notification = new apn.Notification({
        alert: message,
        sound: "default",
        badge: 1 ,
        topic: "com.bengregory.Corn",
        payload: {
            
                "aps": {
                    "alert":{
                        "title":"title",
                        "subtitle":"subtitle",
                        "body":"body"
                    },
            }
        },
        
        pushType: "alert",
        
    });

    let response = await getDeviceToken(recipientId);
    if(response.error) {
        res.status(500).send(response.error);
        return;
    }
    
    let deviceToken = response.data;
    if (!deviceToken) {
        res.status(404).send("No device token found");
        return;
    }

    

    apnProvider.send(notification, deviceToken).then((response) => {
        // Handle response
        console.log(response);
        res.send(response);
    }).catch(error => {
        // Handle error
        console.log(error);
        res.status(500).send(error);
    });
}


function proposeMovieToFriend(senderId: string, recipientId: string, movieId: string) {
    // Todo
}