import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Fragment, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  fetchGetAllContentTexts,
  fetchDeleteContentText,
  ContentTextType,
  GetAllContentTextsQuery
} from '#src/api/workspace/facebookads/resource/content-text/index.js'
import { getContentTextColumns } from './columns'
import { BasicButton } from '#src/components/basic-button'
import { ContentTextModal } from './content-text-modal'
import { ViewContentModal } from './view-content-modal'

export const ListContentText = () => {
  const actionRef = useRef<ActionType>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<ContentTextType>>({})
  const [viewContentData, setViewContentData] = useState<ContentTextType | null>(null)

  const { mutate: deleteContentTextMutation, isPending: isDeleting } = useMutation({
    mutationFn: fetchDeleteContentText,
    onSuccess: () => {
      message.success('Xóa nội dung text thành công')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('Xóa nội dung text thất bại')
    }
  })

  const handleDeleteRow = (id: string) => {
    deleteContentTextMutation(id)
  }

  const handleEditRow = (record: ContentTextType) => {
    setDetailData(record)
    setModalTitle('Chỉnh sửa nội dung text')
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setDetailData({})
    setModalTitle('Thêm nội dung text mới')
    setIsModalOpen(true)
  }

  const handleViewContent = (record: ContentTextType) => {
    setViewContentData(record)
    setIsViewModalOpen(true)
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
    setDetailData({})
  }

  const onCloseViewModal = () => {
    setIsViewModalOpen(false)
    setViewContentData(null)
  }

  const refreshTable = () => {
    actionRef.current?.reload()
  }

  const columns: ProColumns<ContentTextType>[] = [
    ...getContentTextColumns({ onViewContent: handleViewContent }),
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'option',
      width: 150,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size='small'>
          <BasicButton type='link' size='small' icon={<EditOutlined />} onClick={() => handleEditRow(record)}>
            Sửa
          </BasicButton>
          <Popconfirm
            title='Xác nhận xóa nội dung text này?'
            description='Hành động này không thể hoàn tác'
            onConfirm={() => handleDeleteRow(record._id)}
            okText='Xác nhận'
            cancelText='Hủy'
            okButtonProps={{ danger: true }}
          >
            <BasicButton type='link' size='small' danger loading={isDeleting} icon={<DeleteOutlined />}>
              Xóa
            </BasicButton>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <Fragment>
      <ProTable<ContentTextType>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const response = await fetchGetAllContentTexts(params as GetAllContentTextsQuery)

          return {
            data: response.result.list,
            total: response.result.total,
            success: response.success
          }
        }}
        rowKey='_id'
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} nội dung`
        }}
        headerTitle='Danh sách nội dung text'
        toolBarRender={() => [
          <Button key='add' icon={<PlusCircleOutlined />} type='primary' onClick={handleAddNew}>
            Thêm nội dung
          </Button>
        ]}
        scroll={{ x: 1200 }}
        options={{
          reload: true,
          density: true,
          setting: true
        }}
      />

      <ContentTextModal
        title={modalTitle}
        open={isModalOpen}
        onClose={onCloseModal}
        detailData={detailData}
        refreshTable={refreshTable}
      />

      <ViewContentModal open={isViewModalOpen} onClose={onCloseViewModal} contentData={viewContentData} />
    </Fragment>
  )
}

