import dayjs from 'dayjs'
import _ from 'lodash'

export const generateQueryDate = (date?: string | string[]) => {
  const isRangeDate = Array.isArray(date)
  const queryDate = isRangeDate
    ? `&time_range={"since":"${date[0]}","until":"${date[1]}"}`
    : `&time_range={"since":"${date}","until":"${date}"}`
  return queryDate
}

export const removeSpecialCharacters = (str: string) => {
  return _.deburr(str).replace(/[^a-zA-Z0-9]/g, '')
}

export const splitRangeDateIntoFourParts = (rangeDate: string[]) => {
  if (rangeDate.length !== 2) {
    throw new Error('rangeDate phải chứa đúng 2 phần tử: ngày bắt đầu và ngày kết thúc')
  }
  const startDate = dayjs(rangeDate[0])
  const endDate = dayjs(rangeDate[1])
  const totalDays = endDate.diff(startDate, 'day')
  const firstInterval = Math.floor(totalDays / 3)
  const middleDate1 = startDate.add(firstInterval, 'day').format('YYYY-MM-DD')
  const middleDate2 = startDate.add(firstInterval + 1, 'day').format('YYYY-MM-DD')
  return [startDate.format('YYYY-MM-DD'), middleDate1, middleDate2, endDate.format('YYYY-MM-DD')]
}

export const convertDateToDDMMYYYY = (date: string | string[]) => {
  if (date.length === 0) {
    const parts = (date as string).split('-')
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  } else return date
}
