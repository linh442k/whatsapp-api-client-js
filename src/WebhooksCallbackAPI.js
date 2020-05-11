import express from 'express';
import bodyParser from 'body-parser';

class WebhooksCallbackAPI  {

    constructor(express, webhookRoutePath) {
        this._app = express;
        this._webhookRoutePath = webhookRoutePath;
        this._callbacks = new Map();
    }

    init() {
        this._app.use(bodyParser.json());
        this._app.post(this._webhookRoutePath, async (req, res, next) => {
            try {
                console.log(`Received webhook ${req.body.typeWebhook}`);
                let webhookType = null;
                if (req.body.messageData && req.body.messageData.typeMessage) {
                    webhookType = `${req.body.typeWebhook}_${req.body.messageData.typeMessage}`;
                } else {
                    webhookType = req.body.typeWebhook;
                }

                const callback = this._callbacks.get(webhookType)
                if (callback) {
                    console.log(`Found webhook callback`);
                    callback.call(this, req.body);
                    console.log(`Callback invoked successfully!`);
                } else {
                    console.log(`Callback not found`);
                };
                console.log(`End`);
                return res.send();
            } catch (err) {
                next(err); 
            }
        })
    }
    
    /**
     * 
     * @param {Function} callback function 
     */
    createStateInstanceChangedHook(callback) {
        this._callbacks.set("stateInstanceChanged", callback)
    }

    /**
     * 
     * @param {Function} callback function 
     */
    createOutgoingMessageStatusHook(callback) {
        this._callbacks.set("outgoingMessageStatus", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.status);
        })
    }

    /**
     * 
     * @param {Function} callback function
     */
    createIncomingMessageReceivedHookText(callback) {
        this._callbacks.set("incomingMessageReceived_textMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.textMessageData.textMessage);
        })
    }

    /**
     * 
     * @param {Function} callback function 
     */
    createIncomingMessageReceivedHookFile(callback) {
        this._callbacks.set("incomingMessageReceived_imageMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.downloadUrl);
        })
    }

    /**
     * 
     * @param {Function} callback function  
     */
    createIncomingMessageReceivedHookLocation(callback) {
        this._callbacks.set("incomingMessageReceived_locationMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.locationMessageData.latitude, data.messageData.locationMessageData.longitude, data.messageData.locationMessageData.jpegThumbnail);
        })
    }

    /**
     * 
     * @param {Function} callback function  
     */
    createIncomingMessageReceivedHookContact(callback) {
        this._callbacks.set("incomingMessageReceived_contactMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.contactMessageData.displayName, data.messageData.contactMessageData.vcard);
        })
    }

    /**
     * 
     * @param {Function} callback function  
     */
    createIncomingMessageReceivedHookExtendedText(callback) {
        this._callbacks.set("incomingMessageReceived_extendedTextMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.extendedTextMessageData);
        })
    }

    /**
     * 
     * @param {Function} callback function 
     */
    createDeviceInfoHook(callback) {
        this._callbacks.set("deviceInfo", callback)
    }

}

export default WebhooksCallbackAPI;