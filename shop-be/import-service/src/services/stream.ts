import { Product } from "src/types/product"
import { Transform } from "stream"
import { productServices } from "./db"
import { sqsServices } from "./sqs"

export const stream = {
    outputToQueue: () => {
        return new Transform({
            encoding: 'utf8',
            objectMode: true,
            transform: (chunk, _encoding, callback) => {
                try {
                    sqsServices.send(chunk);
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
            transform: (chunk, _encoding, callback) => {
                try {
                    const data: Omit<Product, 'id'> = {
                        count: parseInt(chunk?.count),
                        title: chunk?.title,
                        description: chunk?.description,
                        price: parseFloat(chunk?.price),
                    };
                    console.log(data)

                    productServices.insert(data);
                    callback();
                } catch (err) {
                    console.error(err);
                    callback();
                }
            }
        })
    }
}