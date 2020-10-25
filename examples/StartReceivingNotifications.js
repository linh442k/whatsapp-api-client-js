import whatsAppClient from '../src/index.js'
import dotenv from "dotenv";

// Send WhatsApp message
(async () => {
    dotenv.config()
    const restAPI = whatsAppClient.restAPI(({
        idInstance: process.env.ID_INSTANCE,
        apiTokenInstance: process.env.API_TOKEN_INSTANCE
    }))
    try {
        await restAPI.webhookService.startReceivingNotifications()
        restAPI.webhookService.onReceivingMessageText((body) => {
            console.log(body)
        })
        restAPI.webhookService.onReceivingDeviceStatus((body) => {
            console.log(body)
        })
        restAPI.webhookService.onReceivingAccountStatus((body) => {
            console.log(body)
        })
    } catch (ex) {
        console.log(ex.toString());
    }
})();