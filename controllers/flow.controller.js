// const logger = require('../utils/logger');
const crypto = require('crypto');
const { decryptRequest, encryptResponse, FlowEndpointException } = require('../utils/encryption');
const { getNextScreen } = require('../services/flow.service.js');

class FlowController {
    async handleFlow(req, res) {
        if (!process.env.PRIVATE_KEY) {
            throw new Error(
            'Private key is empty. Please check your env variable "PRIVATE_KEY".'
            );
        }

        if(!this.isRequestSignatureValid(req)) {
            // Return status code 432 if request signature does not match.
            // To learn more about return error codes visit: https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes#endpoint_error_codes
            return res.status(432).send();
        }

        let decryptedRequest = null;
        try {
            decryptedRequest = decryptRequest(req.body, process.env.PRIVATE_KEY, process.env.PASSPHRASE);
        } catch (err) {
            console.error(err);
            if (err instanceof FlowEndpointException) {
            return res.status(err.statusCode).send();
            }
            return res.status(500).send();
        }

        const { aesKeyBuffer, initialVectorBuffer, decryptedBody } = decryptedRequest;
        console.log("💬 Decrypted Request:", decryptedBody);

        // TODO: Uncomment this block and add your flow token validation logic.
        // If the flow token becomes invalid, return HTTP code 427 to disable the flow and show the message in `error_msg` to the user
        // Refer to the docs for details https://developers.facebook.com/docs/whatsapp/flows/reference/error-codes#endpoint_error_codes

        /*
        if (!isValidFlowToken(decryptedBody.flow_token)) {
            const error_response = {
            error_msg: `The message is no longer available`,
            };
            return res
            .status(427)
            .send(
                encryptResponse(error_response, aesKeyBuffer, initialVectorBuffer)
            );
        }
        */

        const screenResponse = getNextScreen(decryptedBody);
        console.log("👉 Response to Encrypt:", screenResponse);

        res.send(encryptResponse(screenResponse, aesKeyBuffer, initialVectorBuffer));
    }

    isRequestSignatureValid(req) {
        if(!process.env.APP_SECRET) {
            console.warn("App Secret is not set up. Please Add your app secret in /.env file to check for request validation");
            return true;
        }

        const signatureHeader = req.get("x-hub-signature-256");
        const signatureBuffer = Buffer.from(signatureHeader.replace("sha256=", ""), "utf-8");

        console.log("💬 Received Request:", req.rawBody);

        const hmac = crypto.createHmac("sha256", process.env.APP_SECRET);
    
        const digestString = hmac.update(req.rawBody).digest('hex');
        const digestBuffer = Buffer.from(digestString, "utf-8");

        if ( !crypto.timingSafeEqual(digestBuffer, signatureBuffer)) {
            console.error("Error: Request Signature did not match");
            return false;
        }
        return true;
    }
}

module.exports = new FlowController();
