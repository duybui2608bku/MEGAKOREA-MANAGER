export enum MediaType {
  Image,
  Video,
  File
}

export interface Media {
  name?: string
  url: string
  type: MediaType
}
