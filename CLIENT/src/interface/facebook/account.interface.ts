import { ActionsOfCampaign } from './facebook.interface'

export interface AccountFacebookAds {
  id: string
  timezone_offset_hours_utc: number
  name: string
  account_status: number
  currency: string
  insights: {
    data: {
      account_id: string
      spend: number
    }[]
    paging: {
      cursors: {
        before: string
        after: string
      }
    }
  }
}

export interface AccountFacebookAds {
  account_id: string
  campaign_id: string
  account_name: string
  campaign_name: string
  date_start: string
  date_stop: string
  account_currency: string
  spend: number
  actions: ActionsOfCampaign[]
  hourly_stats_aggregated_by_advertiser_time_zone?: string
}

export interface Service {
  [key: string]: {
    spend: number
    interact: number
  }
}

export interface DataReportTotal {
  name: string
  account: DataAccountDetails[]
}

export interface DataAccountDetails {
  branch: string
  services: Service[]
}

export interface Revenue {
  date: string
  branch: string
  service: string
  source: string
  totalRevenue: number | string
}

export interface DataReportOfBranch {
  branch: string
  services: {
    service: string
    interact: number
    spend: number
  }[]
}

export interface RevenueTotal {
  result: Revenue[]
  newCustomerRevenue: number
  oldCustomerRevenue: number
  otherRevenue: number
  revenueDataBySource: Revenue[]
  revenueData: Revenue[]
  totalRevenue: number
}
