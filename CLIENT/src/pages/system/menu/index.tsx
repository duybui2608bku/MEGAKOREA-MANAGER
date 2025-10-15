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
import { ButtonEnumType, GlobalEnum } from '#src/enum/global.js'

export default function Menu() {
  const { hasAccessByCodes } = useAccess()

  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<MenuItemType>>({})
  const [flatParentMenus, setFlatParentMenus] = useState<MenuItemType[]>([])

  const actionRef = useRef<ActionType>(null)

  const handleDeleteRow = async (id: string, action?: ProCoreActionType<object>) => {
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
      width: 100,
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
            onConfirm={() => handleDeleteRow(record._id, action)}
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
        rowKey={GlobalEnum.MAIN_KEY as string}
        pagination={false}
        request={async (params) => {
          // console.log(sort, filter);
          const responseData = await fetchMenuList(params)
          const menuTree = handleTree(responseData.result.list, GlobalEnum.MAIN_KEY, 'parentId')

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
            type={ButtonEnumType.PRIMARY}
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
