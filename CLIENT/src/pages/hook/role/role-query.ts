import { useQuery } from '@tanstack/react-query'
import { fetchRoleList } from '#src/api/system/role/index.js'

import { useEffect, useState } from 'react'
import { ROLE_QUERY_KEY } from '../../system/role/querykey'

const RoleValueEnumQuery = () => {
  const [valueEnum, setValueEnum] = useState<Record<string, { text: string }>>({})

  const { data, error } = useQuery({
    queryKey: [ROLE_QUERY_KEY.ROLE_LIST],
    queryFn: fetchRoleList
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

export default RoleValueEnumQuery
