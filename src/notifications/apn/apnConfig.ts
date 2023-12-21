// apnConfig.js
import * as apn from "@parse/node-apn";
import dotenv from 'dotenv';
dotenv.config();

let options = {
  token: {
    key: "src/notifications/apn/key.p8",   // Replace with the path to your .p8 file
    
    keyId: "VJ8U73GZG3", // Replace with your Key ID
    teamId: "QJMXQ6FX46" // Replace with your Team ID
  },
  production:  process.env.NODE_APN_PRODUCTION === "true" ? true : false // Set to true if sending a notification to a production iOS app
};

let apnProvider = new apn.Provider(options);

export default apnProvider;
