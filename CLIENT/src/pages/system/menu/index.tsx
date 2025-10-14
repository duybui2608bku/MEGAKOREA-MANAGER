import type { MenuItemType } from '#src/api/system'
import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { fetchDeleteMenuItem, fetchMenuList } from '#src/api/system/menu'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { accessControlCodes, useAccess } from '#src/hooks'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

import { Detail } from './components/detail'
import { getConstantColumns } from './constants'

export default function Menu() {
  const { hasAccessByCodes } = useAccess()

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<MenuItemType>>({})
  const [flatParentMenus, setFlatParentMenus] = useState<MenuItemType[]>([])

  const actionRef = useRef<ActionType>(null)

  const handleDeleteRow = async (id: number, action?: ProCoreActionType<object>) => {
    const responseData = await fetchDeleteMenuItem(id)
    await action?.reload?.()
    window.$message?.success(`${'Xóa thành công'} id = ${responseData.result}`)
  }

  const columns: ProColumns<MenuItemType>[] = [
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
              setTitle('Sửa menu')
              setDetailData({ ...record })
            }}
          >
            {'Sửa'}
          </BasicButton>,
          <Popconfirm
            key='delete'
            title={'Xác nhận xóa'}
            onConfirm={() => handleDeleteRow(record.id, action)}
            okText={'Xác nhận'}
            cancelText={'Hủy'}
          >
            <BasicButton type='link' size='small' disabled={!hasAccessByCodes(accessControlCodes.delete)}>
              {'Xóa'}
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
      <BasicTable<MenuItemType>
        adaptive
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          // console.log(sort, filter);
          const responseData = await fetchMenuList(params)
          const menuTree = handleTree(responseData.result.list)

          setFlatParentMenus(
            responseData.result.list
              .filter((item) => Number(item.menuType) === 0)
              .map((item) => ({ ...item, name: item.name }))
          )

          return {
            ...responseData,
            data: menuTree,
            total: responseData.result.total
          }
        }}
        headerTitle={`${'Quản lí Menu'}`}
        toolBarRender={() => [
          <Button
            key='add-role'
            icon={<PlusCircleOutlined />}
            type='primary'
            disabled={!hasAccessByCodes(accessControlCodes.add)}
            onClick={() => {
              setIsOpen(true)
              setTitle('Thêm menu')
            }}
          >
            {'Thêm'}
          </Button>
        ]}
      />
      <Detail
        title={title}
        open={isOpen}
        flatParentMenus={flatParentMenus}
        onCloseChange={onCloseChange}
        detailData={detailData}
        refreshTable={refreshTable}
      />
    </BasicContent>
  )
}
