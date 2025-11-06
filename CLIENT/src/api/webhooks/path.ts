const WEBHOOK_ENDPOINT = import.meta.env.VITE_WEBHOOK_ENDPOINT
const WEBHOOK_ENDPOINT_TEST = import.meta.env.VITE_WEBHOOK_ENDPOINT_TEST
export const WEBHOOK_PATH = {
  CREATE_CONTENT_POST: `${WEBHOOK_ENDPOINT}/generate-content-post-of-page`,
  POST_MULTIPLE_OF_PAGE: `${WEBHOOK_ENDPOINT_TEST}/post-mutiple-of-page`
}
