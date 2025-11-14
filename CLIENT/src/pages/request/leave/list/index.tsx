import { useRef, useState } from 'react'
import type { ActionType, ProColumns } from '@ant-design/pro-components'
import { message, Space } from 'antd'
import dayjs from 'dayjs'
import { BasicButton, BasicContent, BasicTable } from '#src/components'
import { useAccess } from '#src/hooks'
import { fetchPendingLeaveRequests } from '#src/api/request/leave'
import type { LeaveRequestType } from '#src/types/request/leave'
import { LeaveTypeLabels, DurationTypeLabels } from '#src/types/request/leave'
import { StatusBadge } from '../components/status-badge'
import { ApproveModal } from '../components/approve-modal'
import { RejectModal } from '../components/reject-modal'
import { DetailModal } from '../components/detail-modal'

export default function PendingLeaveRequests() {
  const actionRef = useRef<ActionType>(null)
  const { hasAccessByRoles } = useAccess()

  const [approveModalOpen, setApproveModalOpen] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequestType | null>(null)

  const handleApprove = (record: LeaveRequestType) => {
    setSelectedRequest(record)
    setApproveModalOpen(true)
  }

  const handleReject = (record: LeaveRequestType) => {
    setSelectedRequest(record)
    setRejectModalOpen(true)
  }

  const handleViewDetail = (record: LeaveRequestType) => {
    setSelectedRequest(record)
    setDetailModalOpen(true)
  }

  const handleSuccess = () => {
    actionRef.current?.reload()
  }

  const columns: ProColumns<LeaveRequestType>[] = [
    {
      title: 'Mã đơn',
      dataIndex: 'request_code',
      width: 180,
      fixed: 'left'
    },
    {
      title: 'Nhân viên',
      dataIndex: ['user', 'name'],
      width: 140,
      render: (_, record) => (
        <div>
          <div>{record.user.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.user.email}</div>
        </div>
      )
    },
    {
      title: 'Bộ phận',
      dataIndex: ['user', 'department', 'name'],
      width: 140,
      render: (_, record) => record.user.department?.name || '-'
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
      title: 'Lý do',
      dataIndex: 'reason',
      width: 200,
      ellipsis: true
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'created_at',
      width: 160,
      sorter: true,
      render: (_, record) => dayjs(record.created_at).format('DD/MM/YYYY HH:mm')
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <BasicButton
            type="link"
            size="small"
            onClick={() => handleViewDetail(record)}
          >
            Chi tiết
          </BasicButton>
          {hasAccessByRoles(['admin', 'manager']) && (
            <>
              <BasicButton
                type="link"
                size="small"
                onClick={() => handleApprove(record)}
              >
                Duyệt
              </BasicButton>
              <BasicButton
                type="link"
                size="small"
                danger
                onClick={() => handleReject(record)}
              >
                Từ chối
              </BasicButton>
            </>
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
          const data = await fetchPendingLeaveRequests({
            ...params,
            current: params.current,
            pageSize: params.pageSize || 20
          })
          return {
            data: data.result.list,
            total: data.result.total,
            success: true
          }
        }}
        search={false}
        scroll={{ x: 1600 }}
      />

      {selectedRequest && (
        <>
          <ApproveModal
            open={approveModalOpen}
            requestId={selectedRequest._id}
            requestCode={selectedRequest.request_code}
            onClose={() => setApproveModalOpen(false)}
            onSuccess={handleSuccess}
          />
          <RejectModal
            open={rejectModalOpen}
            requestId={selectedRequest._id}
            requestCode={selectedRequest.request_code}
            onClose={() => setRejectModalOpen(false)}
            onSuccess={handleSuccess}
          />
          <DetailModal
            open={detailModalOpen}
            data={selectedRequest}
            onClose={() => setDetailModalOpen(false)}
          />
        </>
      )}
    </BasicContent>
  )
}
