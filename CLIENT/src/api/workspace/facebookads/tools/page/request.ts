import type { PostType, CreatePostRequestBody, UpdatePostRequestBody, GetAllPostsQuery } from './types'
import { request } from '#src/utils'
import { PAGE_PATH } from './path'

export * from './types'

export function fetchCreatePost(data: CreatePostRequestBody) {
  return request.post<ApiResponse<PostType>>(PAGE_PATH.CREATE_POST, { json: data }).json()
}

export function fetchGetAllPosts(params: GetAllPostsQuery) {
  return request.get<ApiListResponse<PostType>>(PAGE_PATH.GET_ALL_POSTS, { searchParams: params as any }).json()
}

export function fetchGetPostById(id: string) {
  return request.get<ApiResponse<PostType>>(PAGE_PATH.GET_POST_BY_ID(id)).json()
}

export function fetchUpdatePost(id: string, data: UpdatePostRequestBody) {
  return request.put<ApiResponse<PostType>>(PAGE_PATH.UPDATE_POST(id), { json: data }).json()
}

export function fetchDeletePost(id: string) {
  return request.delete<ApiResponse<void>>(PAGE_PATH.DELETE_POST(id)).json()
}
