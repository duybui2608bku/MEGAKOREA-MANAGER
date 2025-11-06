export interface CreateContentPostResponse {
  content: string
}

export interface PostMutipleOfPageRequestBody {
  content: string
  url: string
  services: string
}

export interface PostMultipleOfPageResponse {}

export interface GenerateContentPostRequestBody {
  services: string
  content: string
  method: string
  icon: boolean
  keyword: string
}
