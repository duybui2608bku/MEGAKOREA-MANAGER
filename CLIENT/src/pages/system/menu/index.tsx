import type { MenuItemType } from '#src/api/system'
import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { fetchDeleteMenuItem, fetchMenuList } from '#src/api/system/menu'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, message, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

import { Detail } from './components/detail'
import { getConstantColumns } from './constants'
import { ButtonEnumType, GlobalEnum } from '#src/enum/global.js'
import { useMutation } from '@tanstack/react-query'

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<MenuItemType>>({})
  const [flatParentMenus, setFlatParentMenus] = useState<MenuItemType[]>([])

  const actionRef = useRef<ActionType>(null)

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => fetchDeleteMenuItem(id),
    onSuccess: () => {
      message.success('Xóa menu thành công!')
    },
    onError: (error: any) => {
      message.error('Xóa menu thất bại! ' + error.message)
    },
    retry: 0
  })

  const handleDeleteRow = async (id: string, action?: ProCoreActionType<object>) => {
    deleteMutate(id)
    await action?.reload?.()
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
            <BasicButton type='link' size='small' loading={isDeleting}>
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
        bordered
        request={async (params) => {
          const responseData = await fetchMenuList(params)
          const menuTree = handleTree(responseData.result.list, GlobalEnum.MAIN_KEY, 'parentId')
          setFlatParentMenus(responseData.result.list.map((item) => ({ ...item, name: item.name })))
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
