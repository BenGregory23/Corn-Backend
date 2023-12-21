// apnConfig.js
import * as apn from "@parse/node-apn";

let options = {
  token: {
    key: "src/notifications/apn/key.p8",   // Replace with the path to your .p8 file
    
    keyId: "VJ8U73GZG3", // Replace with your Key ID
    teamId: "QJMXQ6FX46" // Replace with your Team ID
  },
  production: false // Change to true in production environment
};

let apnProvider = new apn.Provider(options);

export default apnProvider;
