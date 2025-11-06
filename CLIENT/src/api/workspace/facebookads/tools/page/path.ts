const BASE_PATH = 'workspace/facebookads/tools/page'

export const PAGE_PATH = {
  CREATE_POST: `${BASE_PATH}/posts`,
  GET_ALL_POSTS: `${BASE_PATH}/posts`,
  GET_POST_BY_ID: (id: string) => `${BASE_PATH}/posts/${id}`,
  UPDATE_POST: (id: string) => `${BASE_PATH}/posts/${id}`,
  DELETE_POST: (id: string) => `${BASE_PATH}/posts/${id}`
}
