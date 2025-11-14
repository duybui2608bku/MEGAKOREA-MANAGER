import { useQuery } from '@tanstack/react-query'
import { fetchDepartments } from '#src/api/system/derpartment/index.js'

import { Select } from 'antd'
import { useEffect, useState } from 'react'
import { DEPARTMENT_QUERY_KEY } from '../querykey'

interface OptionsDerpartmentProps {
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

const OptionsDerpartment = ({
  value,
  onChange,
  style,
  placeholder = 'Chọn phòng ban',
  disabled,
  multiple = false
}: OptionsDerpartmentProps) => {
  const [departmentsOptions, setDepartmentsOptions] = useState<{ label: string; value: string }[]>([])

  const { data, isLoading, error } = useQuery({
    queryKey: [DEPARTMENT_QUERY_KEY.DEPARTMENT_LIST],
    queryFn: fetchDepartments
  })

  useEffect(() => {
    if (data) {
      const result = data.result.list
      const options = result.map((item) => ({
        label: item.name,
        value: item._id
      }))
      setDepartmentsOptions(options)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setDepartmentsOptions(ERROR_OPTIONS)
    }
  }, [error])

  return (
    <Select
      loading={isLoading}
      placeholder={placeholder}
      disabled={disabled}
      options={departmentsOptions || ERROR_OPTIONS}
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

export default OptionsDerpartment
