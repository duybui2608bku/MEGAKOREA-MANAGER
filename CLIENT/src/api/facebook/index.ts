// import { AccountFacebookAds } from '#src/interface/facebook/account.interface.js'
// import { axiosClientFacebook } from './axious.facebook'
// import { ResponseFacebookAds } from '#src/types/utils.type.js'
// import { EMPTY_STRING } from '#src/constants/index.js'

// const type = 'onsite_conversion.messaging_conversation_started_7d' as const
// const LIMIT_ACCOUNT_ADS = 350
// const LIMIT_INSIGHT_ADS = 5000

// export const facebookApi = {
//   getAdsAccount: () => {
//     return axiosClientFacebook.get<ResponseFacebookAds<AccountFacebookAds[]>>(
//       `me/adaccounts?fields=timezone_offset_hours_utc,name,account_status,currency,insights.level(account){account_id,spend}&limit=${LIMIT_ACCOUNT_ADS}`
//     )
//   },
//   getAccountUtcDetail(id: string, queryDate: string) {
//     return axiosClientFacebook.get<ResponseFacebookAds<AccountFacebookAds[]>>(
//       `${id}/insights?fields=spend,campaign_id,account_name,campaign_name,actions&level=campaign${queryDate}&filtering=[{"field":"action_type", "operator":"CONTAIN", "value":"${type}"}]&limit=${LIMIT_INSIGHT_ADS}`
//     )
//   },
//   batchRequest(batchRequest: any) {
//     return axiosClientFacebook.post(EMPTY_STRING, {
//       batch: batchRequest,
//       include_headers: false
//     })
//   }
// }
