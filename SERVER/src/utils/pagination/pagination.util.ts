export const generatePagination = (current?: string, pageSize?: string) => {
  const currentNumber = parseInt(current || '1') || 1
  const pageSizeNumber = parseInt(pageSize || '10') || 10
  const skip = (currentNumber - 1) * pageSizeNumber
  return {
    current: currentNumber,
    pageSize: pageSizeNumber,
    skip
  }
}
