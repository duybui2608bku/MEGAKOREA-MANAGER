import { S3 } from '@aws-sdk/client-s3'
import { config } from 'dotenv'
import { Upload } from '@aws-sdk/lib-storage'
import fs from 'fs'

config()
const S3_ENDPOINT = 'https://s3-hcm-r1.s3cloud.vn'
const S3_BUCKET = 'fbads-megakorea'

const s3 = new S3({
  region: 'hcm',
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string
  },
  endpoint: S3_ENDPOINT
})

const getS3FileUrl = (bucketName: string, key: string): string => {
  return `${S3_ENDPOINT}/${bucketName}/${key}`
}

const uploadFileToS3 = ({
  filename,
  filepath,
  contenType
}: {
  filename: string
  filepath: string
  contenType: string
}) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: {
      Bucket: S3_BUCKET,
      Key: filename,
      Body: fs.readFileSync(filepath),
      ContentType: contenType,
      ACL: 'public-read',
      ContentDisposition: 'inline',
      ServerSideEncryption: 'AES256'
    },
    tags: [],
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false
  })

  return parallelUploads3.done().then((result) => {
    return {
      ...result,
      Location: getS3FileUrl(S3_BUCKET, filename)
    }
  })
}

export { uploadFileToS3, getS3FileUrl }
