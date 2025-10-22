import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { fetchDeleteRoleItem } from '#src/api/system'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { accessControlCodes, useAccess } from '#src/hooks'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { fetchDepartments } from '#src/api/system/derpartment/index.js'
import { Detail } from '#src/pages/system/dept/components/detail'
import { DepartmentItemType } from '#src/api/system/derpartment/types.js'

const Department = () => {
  const { hasAccessByCodes } = useAccess()

  const deleteRoleItemMutation = useMutation({
    mutationFn: fetchDeleteRoleItem
  })

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<DepartmentItemType> & { menus?: string[] }>({})

  const actionRef = useRef<ActionType>(null)

  const handleDeleteRow = async (id: string, action?: ProCoreActionType<object>) => {
    // const responseData = await deleteRoleItemMutation.mutateAsync(id)
    // await action?.reload?.()
    // window.$message?.success(`Xóa thành công id = ${responseData.result}`)
  }

  const columns: ProColumns<DepartmentItemType>[] = [
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
            // disabled={!hasAccessByCodes(accessControlCodes.update)}
            onClick={async () => {
              // const responseData = await fetchMenuByRoleId({ id: record._id })
              setIsOpen(true)
              setTitle('Sửa phòng ban')
              // setDetailData({ ...record, menus: responseData.result })
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
      <BasicTable<DepartmentItemType>
        adaptive
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const responseData = await fetchDepartments(params)
          console.log(responseData)
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
            // disabled={!hasAccessByCodes(accessControlCodes.add)}
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
        // treeData={handleTree(menuItems || [])}
        treeData={[]}
      />
    </BasicContent>
  )
}

export default Department
