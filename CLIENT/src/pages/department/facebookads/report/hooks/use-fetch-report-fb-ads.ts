import { useQueries, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import _, { chunk, isArray } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  branchCustoms,
  EMPTY_STRING,
  serviceCustoms,
  timeArrayToday,
  timeArrayYesterDay
} from '#src/constants/index.js'
import { StaleTimeEnum, TimeZoneType } from '#src/enum/global.js'
import { QUERY_KEY } from '#src/constants/querykey/fbads/index.js'
import { AccountFacebookAds } from '#src/interface/facebook/account.interface.js'
import { ActionsOfCampaign } from '#src/interface/facebook/facebook.interface.js'
import { facebookApi } from '#src/api/facebook/index.js'
import { generateQueryDate, removeSpecialCharacters, splitRangeDateIntoFourParts } from '#src/utils/index.js'

const CHARACTER_SPECIAL = '-'
const LIMIT_INSIGHT_ADS = 5000

const type = 'onsite_conversion.messaging_conversation_started_7d' as const

const filteringActions = {
  field: 'action_type',
  operator: 'CONTAIN',
  value: type
}

const accountAdsUsd = [
  'MG - XMDN - R.F SCAN33 -7',
  'MG - R.F DH10 +7',
  'MG - BMT29 -7',
  'MG - R.F BMT29 -7',
  'MG - R.F DH36 +7',
  'MG - R.F DH35 +7',
  'MG - R.F QT30 -7',
  'MG - R.F DH32 +7',
  'MG - QT05 (-7) (HUE)',
  'MG - R.F CM37 +7',
  'MG - NO9',
  'MG - QT07 +7',
  'MG - QT33 HUE (-7)'
]

const STATUS_QUERY_SUCCESS = 'success'

const accountAdThb = ['MG - R.F SCAN24 +7']

const currencyRate = 26252
const currencyRateThb = 806.55
const STALE_TIME_INSIGHT = StaleTimeEnum.THREE_MINUTES

const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms))

const FetchReportFbAds = (date?: string | string[]) => {
  const today = useMemo(() => new Date().toISOString().split('T')[0], [])
  const isBefore3pm = useCallback(() => dayjs().isBefore(dayjs().hour(15).minute(0).second(0)), [])
  const [selectDate, setSelectDate] = useState<string>(today)
  const [selectRangeDate, setSelectRangeDate] = useState<string[]>([])

  useEffect(() => {
    if (date && isArray(date)) {
      setSelectRangeDate(date)
    } else {
      setSelectDate(date as string)
    }
  }, [date])

  const beforeSelectDate = dayjs(selectDate).subtract(1, 'day').format('YYYY-MM-DD')
  const isTodayQuery = selectDate === today
  const isNotTodayQuery = !isTodayQuery || (isTodayQuery && !isBefore3pm())
  const [accountIdGmtData, setAccountIdGmtData] = useState<any[]>([])
  const [accountIdUtcData, setAccountIdUtcData] = useState<any[]>([])
  const [totalAccountData, setTotalAccountData] = useState<any[]>([])
  const [totalDataCombined, setTotalDataCombined] = useState<any[]>([])
  const [idsCampaignGmt, setIdsCampaignGmt] = useState<string[]>([])
  const { data: allAccountResponse } = useQuery({
    queryKey: [QUERY_KEY.ALL_ADS_ACCOUNTS],
    queryFn: () => facebookApi.getAdsAccount(),
    staleTime: 150 * 60 * 1000
  })

  const [allAccounts, setAllAccounts] = useState<AccountFacebookAds[]>([])
  const [accountIdGmt, setAccountIdGmt] = useState<AccountFacebookAds[]>([])
  const [accountIdUtc, setAccountIdUtc] = useState<AccountFacebookAds[]>([])

  const batchRequestGmt = useCallback(
    (accountIds: string[]) => {
      const timeRangeAfterSelectDate = encodeURIComponent(
        JSON.stringify({
          since: beforeSelectDate,
          until: beforeSelectDate
        })
      )
      const timeRangeSelectDate = encodeURIComponent(
        JSON.stringify({
          since: selectDate,
          until: selectDate
        })
      )

      const allRequests = accountIds.flatMap((id) =>
        [
          {
            method: 'GET',
            relative_url: `${id}/insights?fields=campaign_id&level=campaign&time_range=${timeRangeAfterSelectDate}&limit=${LIMIT_INSIGHT_ADS}`
          },
          isNotTodayQuery && {
            method: 'GET',
            relative_url: `${id}/insights?fields=campaign_id&level=campaign&time_range=${timeRangeSelectDate}&limit=${LIMIT_INSIGHT_ADS}`
          }
        ].filter(Boolean)
      )

      return allRequests
    },
    [selectDate, beforeSelectDate, isNotTodayQuery]
  )

  const groupedDataUtc = (data: any) => {
    const groupedDetails = data.reduce((acc: Record<string, AccountFacebookAds[]>, item: AccountFacebookAds) => {
      const accountName = item.account_name
      if (!acc[accountName]) acc[accountName] = []
      acc[accountName].push(item)
      return acc
    }, {})

    const formattedDetails = Object.keys(groupedDetails).map((name) => {
      const accounts = groupedDetails[name]
      const branchGrouped: Record<string, any> = {}

      accounts.forEach((account: AccountFacebookAds) => {
        const nameParts = account.campaign_name
          .split(CHARACTER_SPECIAL)
          .map((part: string) => removeSpecialCharacters(part))
        let branchFound = EMPTY_STRING
        let serviceFound = EMPTY_STRING

        nameParts.forEach((part: string) => {
          if (branchCustoms[part as keyof typeof branchCustoms]) {
            branchFound = branchCustoms[part as keyof typeof branchCustoms]
          }
          if (serviceCustoms[part as keyof typeof serviceCustoms]) {
            serviceFound = serviceCustoms[part as keyof typeof serviceCustoms]
          }
        })

        if (branchFound) {
          if (!branchGrouped[branchFound]) {
            branchGrouped[branchFound] = { branch: branchFound, services: [] }
          }

          let spendVal = Number(account.spend) || 0
          if (accountAdsUsd.includes(account.account_name)) {
            spendVal = spendVal * currencyRate
          }

          if (accountAdThb.includes(account.account_name)) {
            spendVal = spendVal * currencyRateThb
          }

          const interactVal = Number(
            account?.actions?.find((a: ActionsOfCampaign) => a.action_type === type)?.value || 0
          )

          const serviceIndex = branchGrouped[branchFound].services.findIndex((s: any) => s[serviceFound])

          if (serviceIndex >= 0) {
            branchGrouped[branchFound].services[serviceIndex][serviceFound].spend += spendVal
            branchGrouped[branchFound].services[serviceIndex][serviceFound].interact += interactVal
          } else {
            branchGrouped[branchFound].services.push({
              [serviceFound]: {
                spend: spendVal,
                interact: interactVal
              }
            })
          }
        }
      })

      return {
        name,
        account: Object.values(branchGrouped)
      }
    })
    return formattedDetails
  }

  const groupedDataGmt = (data: any) => {
    const dataUnique = _.uniqWith(data, _.isEqual)

    const groupedDetails = dataUnique.reduce((acc: Record<string, AccountFacebookAds[]>, item: AccountFacebookAds) => {
      const hour = item.hourly_stats_aggregated_by_advertiser_time_zone
      const date_start = item.date_start
      const isTodayAndAfter3pm = date_start === today && !isBefore3pm()
      const isBeforeSelecDate = beforeSelectDate === date_start

      if (timeArrayToday.includes(hour as string) && (isTodayAndAfter3pm || date_start === selectDate)) {
        const accountName = item.account_name
        if (!acc[accountName]) acc[accountName] = []
        acc[accountName].push(item)
      }
      if (timeArrayYesterDay.includes(hour as string) && isBeforeSelecDate) {
        const accountName = item.account_name
        if (!acc[accountName]) acc[accountName] = []
        acc[accountName].push(item)
      }
      return acc
    }, {})

    const formattedDetails = Object.keys(groupedDetails).map((name) => {
      const accounts = groupedDetails[name]
      const branchGrouped: Record<string, any> = {}

      accounts.forEach((account: AccountFacebookAds) => {
        const nameParts = account.campaign_name
          .split(CHARACTER_SPECIAL)
          .map((part: string) => removeSpecialCharacters(part))

        let branchFound = EMPTY_STRING
        let serviceFound = EMPTY_STRING

        nameParts.forEach((part: string) => {
          if (branchCustoms[part as keyof typeof branchCustoms]) {
            branchFound = branchCustoms[part as keyof typeof branchCustoms]
          }
          if (serviceCustoms[part as keyof typeof serviceCustoms]) {
            serviceFound = serviceCustoms[part as keyof typeof serviceCustoms]
          }
        })

        if (branchFound) {
          if (!branchGrouped[branchFound]) {
            branchGrouped[branchFound] = { branch: branchFound, services: [] }
          }

          let spendVal = Number(account.spend) || 0

          if (accountAdsUsd.includes(account.account_name)) {
            spendVal = spendVal * currencyRate
          }

          if (accountAdThb.includes(account.account_name)) {
            spendVal = spendVal * currencyRateThb
          }

          const interactVal = Number(
            account?.actions?.find((a: ActionsOfCampaign) => a.action_type === type)?.value || 0
          )
          const serviceIndex = branchGrouped[branchFound].services.findIndex((s: any) => s[serviceFound])
          if (serviceIndex >= 0) {
            branchGrouped[branchFound].services[serviceIndex][serviceFound].spend += spendVal
            branchGrouped[branchFound].services[serviceIndex][serviceFound].interact += interactVal
          } else {
            branchGrouped[branchFound].services.push({
              [serviceFound]: {
                spend: spendVal,
                interact: interactVal
              }
            })
          }
        }
      })

      return {
        name,
        account: Object.values(branchGrouped)
      }
    })
    return formattedDetails
  }

  useEffect(() => {
    if (allAccountResponse?.status === 200) {
      const allAccounts: AccountFacebookAds[] = allAccountResponse.data.data || []
      const utcPlus7: AccountFacebookAds[] = []
      const gmtOthers: AccountFacebookAds[] = []
      setAllAccounts(allAccounts)
      allAccounts.forEach((account) => {
        if (account.insights !== undefined) {
          if (account.timezone_offset_hours_utc === TimeZoneType.UTCPlus7) {
            utcPlus7.push(account)
          } else {
            gmtOthers.push(account)
          }
        }
      })
      setAccountIdUtc(utcPlus7)
      setAccountIdGmt(gmtOthers)
    }
  }, [allAccountResponse])

  const accountUtcQueries = useQueries({
    queries: useMemo(
      () =>
        accountIdUtc.map((account) => ({
          queryKey: [QUERY_KEY.UTC_7_DETAIL, account.id, selectDate, selectRangeDate],
          queryFn: () => facebookApi.getAccountUtcDetail(account.id, generateQueryDate(selectDate)),
          enabled: !!account.id && selectRangeDate.length === 0,
          staleTime: STALE_TIME_INSIGHT
        })),
      [accountIdUtc, selectDate, selectRangeDate]
    )
  })

  useEffect(() => {
    const finishedFetch = accountUtcQueries.every((query) => query.status === STATUS_QUERY_SUCCESS)
    if (finishedFetch) {
      const allData = accountUtcQueries
        .map((q) => q.data?.data?.data)
        .filter(Boolean)
        .flat()
      const result = allData && groupedDataUtc(allData)
      setAccountIdUtcData((prev: any) => {
        const isDifferent = !_.isEqual(prev, result)
        if (isDifferent) {
          return result
        }
        return prev
      })
    }
  }, [accountUtcQueries])

  const accountGmtChunks = useMemo(() => {
    return chunk(accountIdGmt, 20)
  }, [accountIdGmt])

  const accountGmtQueries = useQueries({
    queries: useMemo(
      () =>
        accountGmtChunks.map((accountChunk, index) => ({
          queryKey: [QUERY_KEY.GMT_DETAIL_10HTO24H_CHUNK, index, selectDate, selectRangeDate],
          queryFn: async () => {
            await sleep(400)
            const accountIds = accountChunk.map((account) => account.id)
            const batchRequest = batchRequestGmt(accountIds)
            return await facebookApi.batchRequest(batchRequest)
          },
          enabled: accountChunk.length > 0 && selectRangeDate.length === 0,
          staleTime: 2 * 60 * 1000
        })),
      [accountGmtChunks, batchRequestGmt, selectDate, selectRangeDate]
    )
  })

  useEffect(() => {
    const finishedFetch = accountGmtQueries.every((query) => query.status === STATUS_QUERY_SUCCESS)
    if (finishedFetch) {
      const allData = accountGmtQueries
        .map((q) => q.data?.data)
        .filter(Boolean)
        .flat()

      const result =
        allData.length > 0 &&
        allData?.reduce((acc: any, item: any) => {
          const data = JSON?.parse(item?.body)?.data
          if (data?.length > 0) {
            acc?.push(data)
          }
          return acc
        }, [])

      const ids = result.length && result?.flat()?.map((item: any) => item?.campaign_id)
      setIdsCampaignGmt((prev: string[]) => {
        const isDifferent = !_.isEqual(prev, ids)
        if (isDifferent) {
          return ids
        }
        return prev
      })
    }
  }, [accountGmtQueries])

  const batchRequestGmtDetail = useCallback(
    (id: string) => {
      const beforeDate = dayjs(selectDate).subtract(1, 'day').format('YYYY-MM-DD')
      const timeRangeAfterSelectDate = encodeURIComponent(
        JSON.stringify({
          since: beforeDate,
          until: beforeDate
        })
      )
      const timeRangeSelectDate = encodeURIComponent(
        JSON.stringify({
          since: selectDate,
          until: selectDate
        })
      )

      const basicRequest = [
        {
          method: 'GET',
          relative_url: `${id}/insights?fields=actions,spend,campaign_name,account_name&breakdowns=hourly_stats_aggregated_by_advertiser_time_zone&level=campaign&time_range=${timeRangeAfterSelectDate}&limit=${LIMIT_INSIGHT_ADS}&filtering=${encodeURIComponent(
            JSON.stringify([filteringActions])
          )}`
        },
        isNotTodayQuery && {
          method: 'GET',
          relative_url: `${id}/insights?fields=actions,spend,campaign_name,account_name&breakdowns=hourly_stats_aggregated_by_advertiser_time_zone&level=campaign&time_range=${timeRangeSelectDate}&limit=${LIMIT_INSIGHT_ADS}&filtering=${encodeURIComponent(
            JSON.stringify([filteringActions])
          )}`
        }
      ].filter(Boolean)
      return basicRequest
    },
    [isNotTodayQuery, selectDate]
  )

  const AllaccountQueries = useQueries({
    queries: useMemo(
      () =>
        allAccounts.map((account) => ({
          queryKey: [QUERY_KEY.ALL_ACCOUNT_DETAIL, account.id, selectRangeDate],
          queryFn: async () => {
            const [resultOne, resultTwo] = await Promise.all([
              facebookApi.getAccountUtcDetail(
                account.id,
                generateQueryDate([
                  splitRangeDateIntoFourParts(selectRangeDate)[0],
                  splitRangeDateIntoFourParts(selectRangeDate)[1]
                ])
              ),
              facebookApi.getAccountUtcDetail(
                account.id,
                generateQueryDate([
                  splitRangeDateIntoFourParts(selectRangeDate)[2],
                  splitRangeDateIntoFourParts(selectRangeDate)[3]
                ])
              )
            ])
            const result = resultOne.data.data.concat(resultTwo.data.data)
            return result
          },
          enabled: !!account.id && selectRangeDate.length > 0,
          staleTime: 3 * 60 * 1000
        })),
      [allAccounts, selectRangeDate]
    )
  })

  useEffect(() => {
    const finishedFetch = accountUtcQueries.every((query) => query.status === STATUS_QUERY_SUCCESS)
    if (finishedFetch) {
      const allData = accountUtcQueries
        .map((q) => q.data?.data?.data)
        .filter(Boolean)
        .flat()
      const result = allData && groupedDataUtc(allData)
      setAccountIdUtcData((prev: any) => {
        const isDifferent = !_.isEqual(prev, result)
        if (isDifferent) {
          return result
        }
        return prev
      })
    }
  }, [accountUtcQueries])

  useEffect(() => {
    const chunkArray = (array: string[], chunkSize: number) => {
      const result = []
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize))
      }
      return result
    }
    const fetchBatchRequests = async () => {
      try {
        const batches = chunkArray(idsCampaignGmt as string[], 25)
        const batchRequests = batches.map((batch) => batch.flatMap((id) => batchRequestGmtDetail(id)))

        const results = await Promise.all(
          batchRequests.map(async (batchRequest) => {
            try {
              await sleep(400)
              return await facebookApi.batchRequest(batchRequest)
            } catch (error) {
              return null
            }
          })
        )

        const aggregatedResults = results
          .filter(Boolean)
          .map((result: any) => result?.data)
          .filter(Boolean)
          .flat()
          .flat()
          .reduce((acc: any, item: any) => {
            const data = JSON?.parse(item?.body)?.data
            if (data?.length > 0) {
              acc?.push(data)
            }
            return acc
          }, [])
          .flat()

        const grouped = aggregatedResults && groupedDataGmt(aggregatedResults)
        setAccountIdGmtData((prev: any) => {
          const isDifferent = !_.isEqual(prev, grouped)
          if (isDifferent) {
            return grouped
          }
          return prev
        })
      } catch (error) {
        return null
      }
    }

    fetchBatchRequests()
  }, [batchRequestGmtDetail, idsCampaignGmt])

  useEffect(() => {
    const finishedFetch = AllaccountQueries.every((query) => query.status === STATUS_QUERY_SUCCESS)
    if (finishedFetch) {
      const allData = AllaccountQueries.map((query) => query.data)
        .filter(Boolean)
        .flat()
      const result = allData && groupedDataUtc(allData)
      setTotalAccountData((prev: any) => {
        const isDifferent = !_.isEqual(prev, result)
        if (isDifferent) {
          return result
        }
        return prev
      })
    }
  }, [AllaccountQueries])

  useEffect(() => {
    const isAllData = accountIdGmtData?.length > 0 || accountIdUtcData.length > 0
    if (isAllData) {
      const combined = [...accountIdGmtData, ...accountIdUtcData]
      setTotalDataCombined(combined)
    }
    if (selectRangeDate.length > 0) {
      const combined = [...totalAccountData]
      setTotalDataCombined(combined)
    }
  }, [accountIdGmtData, accountIdUtcData, selectRangeDate, totalAccountData])

  return {
    totalDataCombined
  }
}

export default FetchReportFbAds
