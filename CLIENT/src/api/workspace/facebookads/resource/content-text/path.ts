const BASE_PATH = 'workspace/facebookads/resource/content-text'

export const CONTENT_TEXT_PATH = {
  CREATE_CONTENT_TEXT: `${BASE_PATH}/create`,
  GET_ALL_CONTENT_TEXTS: `${BASE_PATH}/get-all`,
  GET_CONTENT_TEXT_BY_ID: (id: string) => `${BASE_PATH}/${id}`,
  UPDATE_CONTENT_TEXT: (id: string) => `${BASE_PATH}/${id}`,
  DELETE_CONTENT_TEXT: (id: string) => `${BASE_PATH}/${id}`
}

