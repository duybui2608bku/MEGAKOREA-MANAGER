import type {
  ContentTextType,
  CreateContentTextRequestBody,
  UpdateContentTextRequestBody,
  GetAllContentTextsQuery
} from './types'
import { request } from '#src/utils'
import { CONTENT_TEXT_PATH } from './path'

export * from './types'

export function fetchCreateContentText(data: CreateContentTextRequestBody) {
  return request.post<ApiResponse<ContentTextType>>(CONTENT_TEXT_PATH.CREATE_CONTENT_TEXT, { json: data }).json()
}

export function fetchGetAllContentTexts(params: GetAllContentTextsQuery) {
  return request
    .get<ApiListResponse<ContentTextType>>(CONTENT_TEXT_PATH.GET_ALL_CONTENT_TEXTS, { searchParams: params as any })
    .json()
}

export function fetchGetContentTextById(id: string) {
  return request.get<ApiResponse<ContentTextType>>(CONTENT_TEXT_PATH.GET_CONTENT_TEXT_BY_ID(id)).json()
}

export function fetchUpdateContentText(id: string, data: UpdateContentTextRequestBody) {
  return request.put<ApiResponse<ContentTextType>>(CONTENT_TEXT_PATH.UPDATE_CONTENT_TEXT(id), { json: data }).json()
}

export function fetchDeleteContentText(id: string) {
  return request.delete<ApiResponse<void>>(CONTENT_TEXT_PATH.DELETE_CONTENT_TEXT(id)).json()
}

