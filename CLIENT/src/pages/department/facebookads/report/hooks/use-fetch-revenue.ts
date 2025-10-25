import { ggsshet } from '#src/utils/gg-sheet/index.js'
import ggsshetBySource from '#src/utils/gg-sheet-by-source/index.js'
import { convertDateToDDMMYYYY } from '#src/utils/index.js'

const SOURCE_OF_CUSTOMER = {
  NEW_CUSTOMER: 'KHÁCH MỚI',
  OLD_CUSTOMER: 'KHÁCH CŨ',
  NEW_CUSTOMER_DEBT: 'KHÁCH MỚI CÔNG NỢ'
}

const TYPE_OF_COSMETIC = {
  MP: 'Mỹ phẩm',
  MP10: 'MP10'
}

const fetchRevenueDataSheet = async (date: string | string[]) => {
  let otherRevenue = 0
  let newCustomerRevenue = 0
  let oldCustomerRevenue = 0
  const dateConvert = convertDateToDDMMYYYY(date)
  const [result, resultBySource] = await Promise.all([ggsshet(dateConvert), ggsshetBySource(dateConvert)])
  const totalRevenue = result.reduce((acc, val) => acc + Number(val.totalRevenue), 0)
  result.forEach((item) => {
    if (item.service === TYPE_OF_COSMETIC.MP || item.service === TYPE_OF_COSMETIC.MP10) {
      otherRevenue += Number(item.totalRevenue)
    }
  })
  resultBySource.forEach((item) => {
    if (item.source === SOURCE_OF_CUSTOMER.NEW_CUSTOMER) {
      newCustomerRevenue += Number(item.totalRevenue)
    } else if (
      item.source === SOURCE_OF_CUSTOMER.OLD_CUSTOMER ||
      item.source === SOURCE_OF_CUSTOMER.NEW_CUSTOMER_DEBT
    ) {
      oldCustomerRevenue += Number(item.totalRevenue)
    }
  })

  const revenueTotal = {
    result,
    revenueDataBySource: resultBySource,
    otherRevenue,
    totalRevenue,
    newCustomerRevenue,
    oldCustomerRevenue
  }
  return revenueTotal
}

export default fetchRevenueDataSheet
