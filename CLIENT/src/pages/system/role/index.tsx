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

import { Detail } from './components/detail'
import { getConstantColumns } from './constants'

export default function Role() {
  const { hasAccessByCodes } = useAccess()
  const { data: menuItems } = useQuery({
    queryKey: ['role-menu'],
    queryFn: async () => {
      const responseData = await fetchRoleMenu()
      return responseData?.result.map((item) => ({
        ...item,
        title: item.name,
        key: item.id
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
              /* 请求角色菜单权限 */
              const responseData = await fetchMenuByRoleId({ id: record.id })
              setIsOpen(true)
              setTitle('Sửa vai trò')
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
        request={async (params) => {
          // console.log(sort, filter);
          const responseData = await fetchRoleList(params)
          return {
            ...responseData,
            data: responseData.result.list,
            total: responseData.result.total
          }
        }}
        headerTitle={`Vai trò （Demo）`}
        toolBarRender={() => [
          <Button
            key='add-role'
            icon={<PlusCircleOutlined />}
            type='primary'
            disabled={!hasAccessByCodes(accessControlCodes.add)}
            onClick={() => {
              setIsOpen(true)
              setTitle('Thêm vai trò')
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
