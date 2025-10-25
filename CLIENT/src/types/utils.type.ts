export interface ResponseFacebookAds<Data = void> {
  data: Data
  paging: {
    cursors: {
      before: string
      after: string
    }
  }
}
