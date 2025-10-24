import path from 'path'

const PATH_UPLOAD = {
  UPLOAD_IMAGE_TERM_DIR: path.resolve('uploads/images/temp'),
  UPLOAD_IMAGE_DIR: path.resolve('uploads/images'),
  UPLOAD_VIDEO_TERM_DIR: path.resolve('uploads/videos/temp'),
  UPLOAD_VIDEO_DIR: path.resolve('uploads/videos'),
  UPLOAD_DOCUMENT_DIR: path.resolve('uploads/documents'),
  UPLOAD_DOCUMENT_TERM_DIR: path.resolve('uploads/documents/temp')
} as const

export default PATH_UPLOAD
