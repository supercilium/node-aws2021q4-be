import { Product } from "src/types/product"
import { Transform } from "stream"
import { productServices } from "./db"
import { sqsServices } from "./sqs"
import { SQSClient } from "@aws-sdk/client-sqs";
import { config } from '../../config'

const { REGION } = config;

export const stream = {
    outputToQueue: () => {
        const client = new SQSClient({ region: REGION });

        return new Transform({
            encoding: 'utf8',
            objectMode: true,
            transform: async (chunk, _encoding, callback) => {
                try {
                    await sqsServices.send(JSON.stringify(chunk), client);
                    callback();
                } catch (err) {
                    console.error(err);
                    callback();
                }
            }
        })
    },
    outputToDB: () => {
        return new Transform({
            encoding: 'utf8',
            objectMode: true,
            transform: async (chunk, _encoding, callback) => {
                try {
                    const data: Omit<Product, 'id'> = {
                        count: parseInt(chunk?.count),
                        title: chunk?.title,
                        description: chunk?.description,
                        price: parseFloat(chunk?.price),
                    };
                    console.log(data)

                    await productServices.insert(data);
                    callback();
                } catch (err) {
                    console.error(err);
                    callback();
                }
            }
        })
    }
}