import { useRef, useState } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { Button, message, Popconfirm, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { fetchMyLeaveRequests, cancelLeaveRequest } from '#src/api/request/leave'
import type { LeaveRequestType } from '#src/types/request/leave'
import {
  LeaveRequestStatus,
  LeaveTypeLabels,
  DurationTypeLabels
} from '#src/types/request/leave'
import { StatusBadge } from '../components/status-badge'
import { DetailModal } from '../components/detail-modal'

export default function MyLeaveRequests() {
  const navigate = useNavigate()
  const actionRef = useRef<ActionType>(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestType | null>(null)

  const { mutate: cancelMutation } = useMutation({
    mutationFn: cancelLeaveRequest,
    onSuccess: () => {
      message.success('Hủy đơn thành công')
      actionRef.current?.reload()
    },
    onError: (error: any) => {
      message.error(`Hủy đơn thất bại: ${error.message}`)
    }
  })

  const handleViewDetail = (record: LeaveRequestType) => {
    setSelectedRequest(record)
    setDetailModalOpen(true)
  }

  const handleCancel = (id: string) => {
    cancelMutation(id)
  }

  const columns: ProColumns<LeaveRequestType>[] = [
    {
      title: 'Mã đơn',
      dataIndex: 'request_code',
      width: 180,
      fixed: 'left'
    },
    {
      title: 'Loại nghỉ',
      dataIndex: 'leave_type',
      width: 140,
      valueType: 'select',
      valueEnum: {
        annual: { text: 'Nghỉ phép năm' },
        sick: { text: 'Nghỉ ốm' },
        personal: { text: 'Nghỉ cá nhân' },
        other: { text: 'Khác' }
      },
      render: (_, record) => LeaveTypeLabels[record.leave_type]
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration_type',
      width: 140,
      render: (_, record) => DurationTypeLabels[record.duration_type]
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      width: 120,
      render: (_, record) => dayjs(record.start_date).format('DD/MM/YYYY')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      width: 120,
      render: (_, record) => dayjs(record.end_date).format('DD/MM/YYYY')
    },
    {
      title: 'Số ngày',
      dataIndex: 'total_days',
      width: 100,
      render: (_, record) => `${record.total_days} ngày`
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 120,
      filters: [
        { text: 'Chờ duyệt', value: LeaveRequestStatus.PENDING },
        { text: 'Đã duyệt', value: LeaveRequestStatus.APPROVED },
        { text: 'Từ chối', value: LeaveRequestStatus.REJECTED },
        { text: 'Đã hủy', value: LeaveRequestStatus.CANCELLED }
      ],
      render: (_, record) => <StatusBadge status={record.status} />
    },
    {
      title: 'Người duyệt',
      dataIndex: ['approver', 'name'],
      width: 140,
      render: (_, record) => record.approver?.name || '-'
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'created_at',
      width: 160,
      render: (_, record) => dayjs(record.created_at).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <BasicButton type="link" size="small" onClick={() => handleViewDetail(record)}>
            Chi tiết
          </BasicButton>
          {record.status === LeaveRequestStatus.PENDING && (
            <Popconfirm
              title="Xác nhận hủy đơn?"
              onConfirm={() => handleCancel(record._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <BasicButton type="link" size="small" danger>
                Hủy đơn
              </BasicButton>
            </Popconfirm>
          )}
        </Space>
      )
    }
  ]

  return (
    <BasicContent className="h-full">
      <BasicTable<LeaveRequestType>
        adaptive
        columns={columns}
        actionRef={actionRef}
        request={async (params) => {
          const data = await fetchMyLeaveRequests({
            ...params,
            current: params.current,
            pageSize: params.pageSize
          })
          return {
            data: data.result.list,
            total: data.result.total,
            success: true
          }
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => navigate('/leave/create')}
          >
            Tạo đơn mới
          </Button>
        ]}
        search={false}
        scroll={{ x: 1400 }}
      />

      <DetailModal open={detailModalOpen} data={selectedRequest} onClose={() => setDetailModalOpen(false)} />
    </BasicContent>
  )
}
