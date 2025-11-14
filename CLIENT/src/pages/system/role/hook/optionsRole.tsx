import { useQuery } from '@tanstack/react-query'
import { fetchRoleList } from '#src/api/system/role/index.js'

import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { ROLE_QUERY_KEY } from '../querykey'

interface OptionsRoleProps {
  value?: string
  onChange?: (value: string) => void
  style?: React.CSSProperties
  placeholder?: string
  disabled?: boolean
  multiple?: boolean
}

const ERROR_OPTIONS = [
  {
    label: 'Có lỗi xảy ra',
    value: ''
  }
]

const OptionsRole = ({
  value,
  onChange,
  style,
  placeholder = 'Chọn vai trò',
  disabled,
  multiple = false
}: OptionsRoleProps) => {
  const [rolesOptions, setRolesOptions] = useState<{ label: string; value: string }[]>([])

  const { data, isLoading, error } = useQuery({
    queryKey: [ROLE_QUERY_KEY.ROLE_LIST],
    queryFn: fetchRoleList
  })

  useEffect(() => {
    if (data) {
      const result = data.result.list
      const options = result.map((item) => ({
        label: item.name,
        value: item._id
      }))
      setRolesOptions(options)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setRolesOptions(ERROR_OPTIONS)
    }
  }, [error])

  return (
    <Select
      loading={isLoading}
      placeholder={placeholder}
      disabled={disabled}
      options={rolesOptions || ERROR_OPTIONS}
      status={error ? 'error' : undefined}
      value={value}
      mode={multiple ? 'multiple' : undefined}
      showSearch
      allowClear
      onChange={onChange}
      optionFilterProp='label'
      style={style}
    />
  )
}

export default OptionsRole
