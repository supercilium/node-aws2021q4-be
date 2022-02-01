import { Product } from "src/types/product"
import { Transform } from "stream"
import { productServices } from "./db"
import { sqsServices } from "./sqs"

export const stream = {
    outputToQueue: () => {
        return new Transform({
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
            transform: (chunk, _encoding, callback) => {
                try {
                    const data: Omit<Product, 'id'> = {
                        count: chunk?.count,
                        title: chunk?.title,
                        description: chunk?.description,
                        price: chunk?.price,
                    };
                    productServices.update(data);
                    callback();
                } catch (err) {
                    console.error(err);
                    callback();
                }
            }
        })
    }
}