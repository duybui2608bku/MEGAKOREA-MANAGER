import type { RoleItemType } from '#src/api/system'
import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { fetchDeleteRoleItem, fetchMenuByRoleId, fetchRoleList, fetchRoleMenu } from '#src/api/system'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { accessControlCodes, useAccess } from '#src/hooks'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { getConstantColumns } from './constants'
import { fetchDepartments } from '#src/api/derpartment/index.js'
import { MENU_QUERY_KEY } from '#src/pages/system/menu/querykey/index.js'
import { Detail } from './components/detail'

export const Derpartment = () => {
  const { hasAccessByCodes } = useAccess()
  const { data: menuItems } = useQuery({
    queryKey: [MENU_QUERY_KEY.MENU_LIST],
    queryFn: async () => {
      const responseData = await fetchDepartments()
      return responseData.result.list.map((item) => ({
        ...item,
        title: item.name,
        key: item._id
      }))
    },
    initialData: []
  })

  const deleteRoleItemMutation = useMutation({
    mutationFn: fetchDeleteRoleItem
  })

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<RoleItemType> & { menus?: string[] }>({})

  const actionRef = useRef<ActionType>(null)

  const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
    const responseData = await deleteRoleItemMutation.mutateAsync(id)
    await action?.reload?.()
    window.$message?.success(`Xóa thành công id = ${responseData.result}`)
  }

  const columns: ProColumns<RoleItemType>[] = [
    ...getConstantColumns(),
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record, _, action) => {
        return [
          <BasicButton
            key='editable'
            type='link'
            size='small'
            disabled={!hasAccessByCodes(accessControlCodes.update)}
            onClick={async () => {
              const responseData = await fetchMenuByRoleId({ id: record.id })
              setIsOpen(true)
              setTitle('Sửa phòng ban')
              setDetailData({ ...record, menus: responseData.result })
            }}
          >
            Sửa
          </BasicButton>,
          <Popconfirm
            key='delete'
            title='Xác nhận xóa?'
            onConfirm={() => handleDeleteRow(record.id, action)}
            okText='Xác nhận'
            cancelText='Hủy'
          >
            <BasicButton type='link' size='small' disabled={!hasAccessByCodes(accessControlCodes.delete)}>
              Xóa
            </BasicButton>
          </Popconfirm>
        ]
      }
    }
  ]

  const onCloseChange = () => {
    setIsOpen(false)
    setDetailData({})
  }

  const refreshTable = () => {
    actionRef.current?.reload()
  }
  return (
    <BasicContent className='h-full'>
      <BasicTable<RoleItemType>
        adaptive
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          const responseData = await fetchDepartments()
          return {
            ...responseData,
            data: responseData.result.list,
            total: responseData.result.total
          }
        }}
        headerTitle={`Phòng ban`}
        toolBarRender={() => [
          <Button
            key='add-role'
            icon={<PlusCircleOutlined />}
            type='primary'
            disabled={!hasAccessByCodes(accessControlCodes.add)}
            onClick={() => {
              setIsOpen(true)
              setTitle('Thêm phòng ban')
            }}
          >
            Thêm
          </Button>
        ]}
      />
      <Detail
        title={title}
        open={isOpen}
        onCloseChange={onCloseChange}
        detailData={detailData}
        refreshTable={refreshTable}
        treeData={handleTree(menuItems || [])}
      />
    </BasicContent>
  )
}
