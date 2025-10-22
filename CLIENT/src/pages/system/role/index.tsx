import type { RoleItemType } from '#src/api/system'
import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { fetchDeleteRoleItem, fetchRoleList } from '#src/api/system'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { accessControlCodes, useAccess } from '#src/hooks'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

import { Detail } from './components/detail'
import { getConstantColumns } from './constants'

export default function Role() {
  const { hasAccessByCodes } = useAccess()

  const deleteRoleItemMutation = useMutation({
    mutationFn: fetchDeleteRoleItem
  })

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<RoleItemType>>({})

  const actionRef = useRef<ActionType>(null)

  const handleDeleteRow = async (_id: string, action?: ProCoreActionType<object>) => {
    await deleteRoleItemMutation.mutateAsync(_id)
    await action?.reload?.()
    window.$message?.success(`Xóa thành công id`)
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
              setIsOpen(true)
              setTitle('Sửa chức vụ')
              setDetailData({ ...record })
            }}
          >
            Sửa
          </BasicButton>,
          <Popconfirm
            key='delete'
            title='Xác nhận xóa?'
            onConfirm={() => handleDeleteRow(record._id, action)}
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
        search={false}
        columns={columns}
        actionRef={actionRef}
        pagination={false}
        request={async (params) => {
          const responseData = await fetchRoleList(params)
          return {
            ...responseData,
            data: responseData.result.list,
            total: responseData.result.total
          }
        }}
        headerTitle={`Chức Vụ`}
        toolBarRender={() => [
          <Button
            key='add-role'
            icon={<PlusCircleOutlined />}
            type='primary'
            disabled={!hasAccessByCodes(accessControlCodes.add)}
            onClick={() => {
              setIsOpen(true)
              setTitle('Thêm chức vụ')
            }}
          >
            Thêm chức vụ
          </Button>
        ]}
      />
      <Detail
        title={title}
        open={isOpen}
        onCloseChange={onCloseChange}
        detailData={detailData}
        refreshTable={refreshTable}
      />
    </BasicContent>
  )
}
