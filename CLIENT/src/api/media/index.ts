import { request } from '#src/utils'
import { MEDIA_PATH } from './path'
import { Media } from './types'

export function uploadImage(data: FormData) {
  return request.post(MEDIA_PATH.UPLOAD_IMAGE, { body: data }).json<ApiResponse<Media[]>>()
}

export function uploadVideo(data: FormData) {
  return request.post(MEDIA_PATH.UPLOAD_VIDEO, { body: data }).json<ApiResponse<Media[]>>()
}

export function uploadDocument(data: FormData) {
  return request.post(MEDIA_PATH.UPLOAD_DOCUMENT, { body: data }).json<ApiResponse<Media[]>>()
}
