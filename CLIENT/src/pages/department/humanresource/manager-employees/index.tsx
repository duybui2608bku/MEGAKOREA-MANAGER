import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { BasicButton, BasicContent, BasicTable } from '#src/components'

import { message, Popconfirm } from 'antd'
import { useRef, useState } from 'react'

import { Detail } from './components/detail'

import { ButtonEnumType, GlobalEnum } from '#src/enum/global.js'
import { UserInfoType } from '#src/api/user/types.js'
import { getConstantColumns } from './constants'
import { fetchAllEmployees, fetchDeleteEmployee } from '#src/api/workspace/hr/index.js'
import { useMutation } from '@tanstack/react-query'
import { PlusCircleOutlined } from '@ant-design/icons'
import AddEmployeeModal from './components/add-employee'

export default function ManagerEmployees() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<UserInfoType>>({})
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)
  const actionRef = useRef<ActionType>(null)

  const { mutate: deleteEmployeeMutate, isPending: isDeleting } = useMutation({
    mutationFn: fetchDeleteEmployee,
    onSuccess: () => {
      message.success('Xóa nhân viên thành công')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('Xóa nhân viên thất bại')
    }
  })

  const handleDeleteRow = async (id: string) => {
    deleteEmployeeMutate(id)
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
            // disabled={!hasAccessByRoles(AccessControlRoles.admin )}
            onClick={async () => {
              setIsOpen(true)
              setTitle('Sửa nhân viên')
              setDetailData({ ...record })
            }}
          >
            {'Sửa'}
          </BasicButton>,
          <Popconfirm
            key='delete'
            // disabled={!hasAccessByRoles(AccessControlRoles.admin)}
            title={'Xác nhận xóa'}
            onConfirm={() => handleDeleteRow(record._id)}
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
        toolBarRender={() => [
          <BasicButton
            key='add-role'
            icon={<PlusCircleOutlined />}
            type={ButtonEnumType.PRIMARY}
            onClick={() => {
              setIsAddEmployeeOpen(true)
            }}
          >
            {'Thêm'}
          </BasicButton>
        ]}
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
      />
      <Detail
        title={title}
        open={isOpen}
        onCloseChange={onCloseChange}
        detailData={detailData}
        refreshTable={refreshTable}
      />
      <AddEmployeeModal open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen} />
    </BasicContent>
  )
}
