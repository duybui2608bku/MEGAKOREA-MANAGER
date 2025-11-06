import formidable from 'formidable'
import fs from 'fs'
import { Request } from 'express'
import { File } from 'formidable'
import PATH_UPLOAD from './dir'

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: PATH_UPLOAD.UPLOAD_IMAGE_TERM_DIR,
    maxFiles: 10,
    keepExtensions: true,
    maxFileSize: 30 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.image) {
        reject(new Error('Image is required'))
      }
      resolve(files.image as File[])
    })
  })
}

export const handleUploadVideo = async (req: Request) => {
  const form = formidable({
    uploadDir: PATH_UPLOAD.UPLOAD_VIDEO_TERM_DIR,
    maxFiles: 3,
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.video) {
        reject(new Error('Video is required'))
      }
      resolve(files.video as File[])
    })
  })
}

export const handleUploadDocument = async (req: Request) => {
  const form = formidable({
    uploadDir: PATH_UPLOAD.UPLOAD_DOCUMENT_TERM_DIR,
    maxFiles: 5,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid =
        name === 'document' &&
        (mimetype?.includes('msword') ||
          mimetype?.includes('vnd.openxmlformats-officedocument.wordprocessingml.document') ||
          mimetype?.includes('vnd.ms-excel') ||
          mimetype?.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet') ||
          mimetype?.includes('pdf'))
      if (!valid) {
        form.emit('error' as any, new Error('Invalid file type') as any)
      }
      return valid || false
    }
  })

  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      if (!files.document) {
        reject(new Error('Document is required'))
      }
      resolve(files.document as File[])
    })
  })
}

export const initFolder = () => {
  ;[PATH_UPLOAD.UPLOAD_IMAGE_TERM_DIR, PATH_UPLOAD.UPLOAD_VIDEO_TERM_DIR, PATH_UPLOAD.UPLOAD_DOCUMENT_TERM_DIR].forEach(
    (dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    }
  )
}

export const getNameFromFullName = (fullname: string) => {
  const name = fullname.split('.')[0]
  return name
}
