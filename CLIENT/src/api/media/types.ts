export interface Media {
  name: string
  url: string
  type: MediaType
}

export enum MediaType {
  Image = 'image',
  Video = 'video',
  Document = 'document'
}
