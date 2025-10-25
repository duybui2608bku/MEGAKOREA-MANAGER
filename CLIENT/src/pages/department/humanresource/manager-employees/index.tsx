import type { MenuItemType } from '#src/api/system'
import type { ActionType, ProColumns, ProCoreActionType } from '@ant-design/pro-components'
import { fetchDeleteMenuItem, fetchMenuList } from '#src/api/system/menu'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { handleTree } from '#src/utils'

import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, message, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

// import { Detail } from './components/detail'

import { ButtonEnumType, GlobalEnum } from '#src/enum/global.js'
import { UserInfoType } from '#src/api/user/types.js'
import { getConstantColumns } from './constants'
import { fetchAllEmployees } from '#src/api/workspace/hr/index.js'
import { useMutation } from '@tanstack/react-query'

export default function ManagerEmployees() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<UserInfoType>>({})

  const actionRef = useRef<ActionType>(null)

  const { mutate: deleteEmployeeMutate, isPending: isDeleting } = useMutation({
    mutationFn: fetchDeleteMenuItem,
    onSuccess: () => {
      message.success('Xóa nhân viên thành công')
    },
    onError: () => {
      message.error('Xóa nhân viên thất bại')
    }
  })

  const handleDeleteRow = async (id: string, action?: ProCoreActionType<object>) => {
    deleteEmployeeMutate(id)
    await action?.reload?.()
  }

  const columns: ProColumns<UserInfoType>[] = [
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
      <BasicTable<UserInfoType>
        adaptive
        columns={columns}
        actionRef={actionRef}
        rowKey={GlobalEnum.MAIN_KEY as string}
        pagination={false}
        bordered
        request={async (requestParams) => {
          const responseData = await fetchAllEmployees(requestParams)
          return {
            ...responseData,
            data: responseData.result.list,
            total: responseData.result.total
          }
        }}
        headerTitle={`${'Quản lí nhân viên'}`}
        toolBarRender={() => [
          <Button
            key='add-role'
            icon={<PlusCircleOutlined />}
            type={ButtonEnumType.PRIMARY}
            onClick={() => {
              setIsOpen(true)
              setTitle('Thêm nhân viên')
            }}
          >
            {'Thêm'}
          </Button>
        ]}
      />
      {/* <Detail
        title={title}
        open={isOpen}
        flatParentMenus={flatParentMenus}
        onCloseChange={onCloseChange}
        detailData={detailData}
        refreshTable={refreshTable}
      /> */}
    </BasicContent>
  )
}
