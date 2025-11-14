import { useQuery } from '@tanstack/react-query'
import { fetchDepartments } from '#src/api/system/derpartment/index.js'
import { useEffect, useState } from 'react'
import { DEPARTMENT_QUERY_KEY } from '../../system/dept/querykey'

const DepValueEnumQuery = () => {
  const [valueEnum, setValueEnum] = useState<Record<string, { text: string }>>({})

  const { data, isLoading, error } = useQuery({
    queryKey: [DEPARTMENT_QUERY_KEY.DEPARTMENT_LIST],
    queryFn: fetchDepartments
  })

  useEffect(() => {
    if (data) {
      const result = data.result.list
      const valueEnum = result.reduce((acc, item) => {
        acc[item._id] = {
          text: item.name
        }
        return acc
      }, {} as Record<string, { text: string }>)
      setValueEnum(valueEnum as Record<string, { text: string }>)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setValueEnum({})
    }
  }, [error])

  return valueEnum
}

export default DepValueEnumQuery
