import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { Fragment, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  fetchGetAllPosts,
  fetchDeletePost,
  PostType,
  GetAllPostsQuery
} from '#src/api/workspace/facebookads/tools/page/index.js'
import { getPostColumns } from './components/columns-of-list-post'
import { BasicButton } from '#src/components/basic-button'
import { PostModal } from './components/post-modal'

export const ListPostedOfPage = () => {
  const actionRef = useRef<ActionType>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [detailData, setDetailData] = useState<Partial<PostType>>({})

  const { mutate: deletePostMutation, isPending: isDeleting } = useMutation({
    mutationFn: fetchDeletePost,
    onSuccess: () => {
      message.success('Xóa bài viết thành công')
      actionRef.current?.reload()
    },
    onError: () => {
      message.error('Xóa bài viết thất bại')
    }
  })

  const handleDeleteRow = (id: string) => {
    deletePostMutation(id)
  }

  const handleEditRow = (record: PostType) => {
    setDetailData(record)
    setModalTitle('Chỉnh sửa bài viết')
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setDetailData({})
    setModalTitle('Thêm bài viết mới')
    setIsModalOpen(true)
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
    setDetailData({})
  }

  const refreshTable = () => {
    actionRef.current?.reload()
  }

  const columns: ProColumns<PostType>[] = [
    ...getPostColumns(),
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
            title='Xác nhận xóa bài viết này?'
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
      <ProTable<PostType>
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const response = await fetchGetAllPosts(params as GetAllPostsQuery)
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
          showTotal: (total) => `Tổng ${total} bài viết`
        }}
        headerTitle='Danh sách bài viết đã đăng'
        toolBarRender={() => [
          <Button key='add' icon={<PlusCircleOutlined />} type='primary' onClick={handleAddNew}>
            Thêm bài viết
          </Button>
        ]}
        scroll={{ x: 1200 }}
        options={{
          reload: true,
          density: true,
          setting: true
        }}
      />

      <PostModal
        title={modalTitle}
        open={isModalOpen}
        onClose={onCloseModal}
        detailData={detailData}
        refreshTable={refreshTable}
      />
    </Fragment>
  )
}
