import { S3Client } from '@aws-sdk/client-s3';

export const minioClient = new S3Client({
  endpoint: process.env.MINIO_PUBLIC_ENDPOINT || 'http://localhost:9000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || 'minioadmin',
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = process.env.MINIO_BUCKET || 'images';
