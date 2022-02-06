import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns'

import { config } from '../../config'

const { REGION, SNS_ARN } = config;
const client = new SNSClient({ region: REGION });

export const snsServices = {
    send: async (msg: any) => {
        const params: PublishCommandInput = {
            TargetArn: SNS_ARN,
            Subject: 'Inserting record to database',
            Message: msg,
        };
        const command = new PublishCommand(params);

        try {
            const data = await client.send(command);
            console.log(data)
            return data;
        } catch (err) {
            console.log(err)
        }
    },
}