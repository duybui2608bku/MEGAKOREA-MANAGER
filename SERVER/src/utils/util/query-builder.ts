/**
 * Escape special regex characters
 */
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Build regex search filter for multiple fields
 * @param fields - Object mapping field names to search values
 * @param options - Configuration for decoding and case sensitivity
 */
export const buildSearchFilter = <T = any>(
  fields: Record<string, string | undefined>,
  options: {
    decode?: string[] // Fields cần decode
    caseSensitive?: boolean
  } = {}
): Partial<T> => {
  const { decode = [], caseSensitive = false } = options
  const filter: any = {}

  Object.entries(fields).forEach(([field, value]) => {
    if (value) {
      const shouldDecode = decode.includes(field)
      const processedValue = shouldDecode ? decodeURIComponent(value) : value

      filter[field] = {
        $regex: escapeRegex(processedValue),
        $options: caseSensitive ? '' : 'i'
      }
    }
  })

  return filter
}

/**
 * Build date range filter
 */
export const buildDateFilter = (
  fieldName: string,
  startDate?: string | Date,
  endDate?: string | Date
): Record<string, any> => {
  if (!startDate && !endDate) return {}

  const dateFilter: any = {}

  if (startDate && endDate) {
    dateFilter[fieldName] = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  } else if (startDate) {
    dateFilter[fieldName] = { $gte: new Date(startDate) }
  } else if (endDate) {
    dateFilter[fieldName] = { $lte: new Date(endDate) }
  }

  return dateFilter
}

/**
 * Build exact match filter
 */
export const buildExactFilter = <T = any>(fields: Record<string, any>): Partial<T> => {
  const filter: any = {}

  Object.entries(fields).forEach(([field, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      filter[field] = value
    }
  })

  return filter
}

/**
 * Build array contains filter ($in operator)
 */
export const buildInFilter = <T = any>(fields: Record<string, any[] | undefined>): Partial<T> => {
  const filter: any = {}

  Object.entries(fields).forEach(([field, values]) => {
    if (values && values.length > 0) {
      filter[field] = { $in: values }
    }
  })

  return filter
}

/**
 * Build numeric range filter
 */
export const buildNumericRangeFilter = (fieldName: string, min?: number, max?: number): Record<string, any> => {
  if (min === undefined && max === undefined) return {}

  const filter: any = {}

  if (min !== undefined && max !== undefined) {
    filter[fieldName] = { $gte: min, $lte: max }
  } else if (min !== undefined) {
    filter[fieldName] = { $gte: min }
  } else if (max !== undefined) {
    filter[fieldName] = { $lte: max }
  }

  return filter
}

/**
 * Combine multiple filters
 */
export const combineFilters = <T = any>(...filters: Partial<T>[]): Partial<T> => {
  return Object.assign({}, ...filters)
}
