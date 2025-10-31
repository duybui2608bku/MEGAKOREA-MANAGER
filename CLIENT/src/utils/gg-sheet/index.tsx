import { serviceCustoms } from '#src/constants/index.js'
import Papa from 'papaparse'
import _ from 'lodash'

interface SheetRecord {
  date: string
  service: string
  branch: string
  totalRevenue: number | string
  source?: string
}

const standardizeDateFormat = (date: string): string => {
  if (!date || typeof date !== 'string') {
    return ''
  }
  const parts = date.trim().split('/')
  if (parts.length !== 3) {
    return ''
  }

  const day = parts[0] ? parts[0].padStart(2, '0') : '00'
  const month = parts[1] ? parts[1].padStart(2, '0') : '00'
  const year = parts[2] || '0000'

  return `${day}/${month}/${year}`
}

const convertDateToDDMMYYYY = (date: string): string => {
  if (!date || typeof date !== 'string') {
    return ''
  }
  const [year, month, day] = date.split('-')
  if (!day || !month || !year) {
    return ''
  }
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
}

const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Ngày không hợp lệ')
  }

  if (start > end) {
    throw new Error('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc')
  }

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    dates.push(`${year}-${month}-${day}`)
  }

  return dates
}

export const ggsshet = async (dateOrDates: string | string[]): Promise<SheetRecord[]> => {
  const sheetUrl =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSRidENexPVq4AtAGdOXw2Rz6lWMxj-bzYSEAGnx5KZQitlt3E_2jJdK37i-VTMBuMrqLAV32tzVTRs/pub?output=csv'

  try {
    let filterDates: string[]
    if (Array.isArray(dateOrDates)) {
      if (dateOrDates.length === 0) {
        throw new Error('Mảng ngày không được rỗng')
      } else if (dateOrDates.length === 1) {
        filterDates = [dateOrDates[0]]
      } else {
        const sortedDates = dateOrDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        const startDate = sortedDates[0]
        const endDate = sortedDates[sortedDates.length - 1]
        filterDates = getDatesInRange(startDate, endDate)
      }
    } else {
      filterDates = [dateOrDates]
    }
    const response = await fetch(sheetUrl)
    if (!response.ok) {
      throw new Error('Không thể tải file CSV từ Google Sheets')
    }
    const csvText = await response.text()
    const parsedResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true
    })

    if (parsedResult.errors.length > 0) {
      console.error('Papa parse errors:', parsedResult.errors)
      throw new Error('Lỗi parse CSV')
    }

    const rawData = (parsedResult.data as Array<any>) || []
    if (!rawData.length) {
      throw new Error('Không có dữ liệu từ Google Sheets')
    }
    const standardizedData: SheetRecord[] = []
    const keys = Object.keys(rawData[0] || {})

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (key && !key.includes('_') && rawData[0][key]) {
        for (const row of rawData) {
          const branch = key
          let date = row[key]
          const service = row[`${key}_1`] || ''
          const totalRevenueStr = row[`${key}_2`] || '0'
          const source = row[`${key}_3`] || ''

          const cleanRevenueStr = totalRevenueStr.replace(/[^0-9-]/g, '')
          const totalRevenue = parseFloat(cleanRevenueStr) || 0

          if (date) {
            date = standardizeDateFormat(date)
            standardizedData.push({
              date,
              service,
              branch,
              totalRevenue,
              source
            })
          }
        }
      }
    }

    const filteredBySource = standardizedData.filter((item) => !['Số trùng', 'Số khác'].includes(item.source || ''))

    const standardizedFilterDates = filterDates.map((date) => {
      const convertedDate = convertDateToDDMMYYYY(date)
      if (!convertedDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        throw new Error(`Ngày ${date} không đúng định dạng YYYY-MM-DD!`)
      }
      return standardizeDateFormat(convertedDate)
    })

    const filteredData = filteredBySource.filter((item) => standardizedFilterDates.includes(item.date))

    const groupedData = _.groupBy(filteredData, (item) => `${item.branch}|${item.service}`)

    const accumulatedData: SheetRecord[] = Object.values(groupedData).map((group) => ({
      date: group[0].date,
      branch: group[0].branch,
      service: serviceCustoms[group[0].service as keyof typeof serviceCustoms] || group[0].service,
      totalRevenue: _.sumBy(group, (item) => Number(item.totalRevenue)),
      source: group[0].source
    }))

    return accumulatedData
  } catch (error) {
    throw error
  }
}
