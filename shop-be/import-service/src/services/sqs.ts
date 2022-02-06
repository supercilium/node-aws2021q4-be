import { SQSClient, SendMessageBatchCommand, SendMessageBatchCommandInput, SendMessageCommandInput, SendMessageCommand } from "@aws-sdk/client-sqs";

import { config } from '../../config'

const { SQS_URL } = config;

export const sqsServices = {
    send: async (msg: any, client: SQSClient) => {
        const params: SendMessageCommandInput = {
            QueueUrl: SQS_URL,
            MessageBody: msg
        };
        const command = new SendMessageCommand(params);

        try {
            const data = await client.send(command);
            console.log(data)
            return;
        } catch (err) {
            console.log(err)
        }
    },
    sendBatch: async (msg: any, client: SQSClient) => {
        const params: SendMessageBatchCommandInput = {
            QueueUrl: SQS_URL,
            Entries: msg
        };
        const command = new SendMessageBatchCommand(params);

        try {
            const data = await client.send(command);
            return data;
        } catch (err) {
            console.log(err)
        }
    },
}