import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { deleteDepartment, fetchMenuByDeptId } from '#src/api/system/derpartment/index.js'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { accessControlCodes, AccessControlRoles, useAccess } from '#src/hooks'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'
import { getConstantColumns } from './constants'
import { fetchDepartments } from '#src/api/system/derpartment/index.js'
import { Detail } from './components/detail'
import { DepartmentItemType } from '#src/api/system/derpartment/types.js'
import { GlobalEnum } from '#src/enum/global.js'
import { fetchMenuList, MenuItemType } from '#src/api/system/index.js'

const Derpartment = () => {
  const { hasAccessByCodes } = useAccess()

  const deleteDepartmentMutation = useMutation({
    mutationFn: deleteDepartment
  })

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<DepartmentItemType>>({})
  const [menuTree, setMenuTree] = useState<MenuItemType[]>([])

  const actionRef = useRef<ActionType>(null)

  const handleDeleteRow = async (id: string, action?: ProCoreActionType<object>) => {
    await deleteDepartmentMutation.mutateAsync(id)
    window.$message?.success(`Xóa thành công`)
    await action?.reload?.()
  }

  const columns: ProColumns<DepartmentItemType>[] = [
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
            disabled={!hasAccessByCodes(AccessControlRoles.admin)}
            onClick={async () => {
              const responseData = await fetchMenuList({
                current: 1,
                pageSize: 1000
              })
              setIsOpen(true)
              setTitle('Sửa phòng ban')
              setMenuTree(responseData.result.list)
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
            <BasicButton type='link' size='small' disabled={!hasAccessByCodes(AccessControlRoles.admin)}>
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
        pagination={false}
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const responseData = await fetchDepartments(params)
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
            disabled={!hasAccessByCodes(AccessControlRoles.admin)}
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
        treeData={handleTree(menuTree, GlobalEnum.MAIN_KEY, 'parentId')}
      />
    </BasicContent>
  )
}

export default Derpartment
