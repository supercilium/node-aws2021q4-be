import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand, PutObjectCommandInput, GetObjectCommandInput, S3 } from '@aws-sdk/client-s3';
import { config } from '../../config';
import { S3EventRecord } from 'aws-lambda';

const { PREFIX, BUCKET_NAME, REGION, EXPIRES_IN } = config;

export const bucketServices = {
    getSignedUrl: async (name: string) => {
        const s3 = new S3({ region: REGION });

        const commandParams: PutObjectCommandInput = {
            Bucket: BUCKET_NAME,
            Key: `${PREFIX}/${name}`,
            ContentType: 'text/csv'
        }
        const command = new PutObjectCommand(commandParams);

        return await getSignedUrl(s3, command, { expiresIn: EXPIRES_IN })
    },
    getObject: async (element: S3EventRecord) => {
        const s3 = new S3({ region: REGION });

        const { s3: { object: { key } } } = element;
        const params: GetObjectCommandInput = { Bucket: BUCKET_NAME, Key: key.replace(/\+/g, ' '), ResponseContentEncoding: 'utf8', ResponseContentType: 'text/csv' }

        return await s3.getObject(params)
    },
}