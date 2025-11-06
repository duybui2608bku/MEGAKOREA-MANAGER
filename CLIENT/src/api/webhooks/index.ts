import { request } from '#src/utils/request/index.js'
import { WEBHOOK_PATH } from './path'
import {
  CreateContentPostResponse,
  PostMutipleOfPageRequestBody,
  PostMultipleOfPageResponse,
  GenerateContentPostRequestBody
} from './types'

export function createContentPost(data: GenerateContentPostRequestBody) {
  return request
    .post(WEBHOOK_PATH.CREATE_CONTENT_POST, { json: data, prefixUrl: '' })
    .json<ApiWebhooksResponse<CreateContentPostResponse>>()
}

export function postMultipleOfPage(data: PostMutipleOfPageRequestBody) {
  return request
    .post(WEBHOOK_PATH.POST_MULTIPLE_OF_PAGE, { json: data, prefixUrl: '' })
    .json<ApiWebhooksResponse<PostMultipleOfPageResponse>>()
}
