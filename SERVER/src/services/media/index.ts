import { Request } from 'express'

import sharp from 'sharp'
import PATH_UPLOAD from './dir'
import path from 'path'
import fs from 'fs'
import { config } from 'dotenv'

import { CompleteMultipartUploadCommandOutput } from '@aws-sdk/client-s3'
import { handleUploadDocument, handleUploadImage, handleUploadVideo } from './util'
import { getNameFromFullName } from './util'
import { uploadFileToS3 } from '~/utils/util/s3'
import { Media, MediaType } from '~/interfaces/media'

config()
class MediasService {
  private getContentTypeByExtension = (ext: string): string => {
    const mimeTypes: { [key: string]: string } = {
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.mkv': 'video/x-matroska',
      '.webm': 'video/webm',
      '.dwg': 'application/acad'
    }

    return mimeTypes[ext] || 'application/octet-stream'
  }

  private deleteFileIfExists = (filePath: string): void => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.warn(`Failed to delete file: ${filePath}`, error)
    }
  }

  async UploadImage(req: Request) {
    const file = await handleUploadImage(req)
    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}.jpg`
        const newPath = path.resolve(PATH_UPLOAD.UPLOAD_IMAGE_DIR, newFullFileName)
        const tempFilePath = file.filepath

        try {
          await sharp(file.filepath).jpeg().toFile(newPath)
          const s3Result = await uploadFileToS3({
            filename: newFullFileName,
            filepath: newPath,
            contenType: 'image/jpeg/jfif/jp2/jpx/pjpeg/png/webp'
          })
          return {
            name: file.originalFilename as string,
            url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
            type: MediaType.Image
          }
        } finally {
          this.deleteFileIfExists(newPath)
          this.deleteFileIfExists(tempFilePath)
        }
      })
    )
    return results
  }

  async UploadDocument(req: Request) {
    const file = await handleUploadDocument(req)
    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        const ext = path.extname(file.newFilename).toLowerCase()
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}${ext}`
        const tempFilePath = file.filepath
        const contentType = this.getContentTypeByExtension(ext)

        try {
          const s3Result = await uploadFileToS3({
            filename: newFullFileName,
            filepath: tempFilePath,
            contenType: contentType
          })
          return {
            name: file.originalFilename as string,
            url: (s3Result as CompleteMultipartUploadCommandOutput).Location as string,
            type: MediaType.File
          }
        } finally {
          this.deleteFileIfExists(tempFilePath)
        }
      })
    )
    return results
  }

  async UploadVideo(req: Request) {
    const file = await handleUploadVideo(req)

    const results: Media[] = await Promise.all(
      file.map(async (file) => {
        const ext = path.extname(file.newFilename).toLowerCase()
        const newName = getNameFromFullName(file.newFilename)
        const newFullFileName = `${newName}${ext}`
        const tempFilePath = file.filepath
        const contentType = this.getContentTypeByExtension(ext)

        try {
          const s3Result = await uploadFileToS3({
            filename: newFullFileName,
            filepath: tempFilePath,
            contenType: contentType
          })
          console.log('s3Result', s3Result)
          return {
            name: file.originalFilename as string,
            url: `https://megakorea.s3-hcm-r1.s3cloud.vn/${newFullFileName}`,
            type: contentType.startsWith('video/') ? MediaType.Video : MediaType.File
          }
        } finally {
          this.deleteFileIfExists(tempFilePath)
        }
      })
    )

    return results
  }
}
const mediasService = new MediasService()
export default mediasService
