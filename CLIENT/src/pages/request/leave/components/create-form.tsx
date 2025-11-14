import { ProForm, ProFormSelect, ProFormRadio, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-components'
import { message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { createLeaveRequest } from '#src/api/request/leave'
import type { CreateLeaveRequestDTO } from '#src/types/request/leave'
import { LeaveType, DurationType } from '#src/types/request/leave'

export function CreateForm() {
  const navigate = useNavigate()

  const { mutate: createMutation, isPending } = useMutation({
    mutationFn: createLeaveRequest,
    onSuccess: () => {
      message.success('Tạo đơn nghỉ phép thành công')
      navigate('/leave/my-request')
    },
    onError: (error: any) => {
      message.error(`Tạo đơn thất bại: ${error.message}`)
    }
  })

  const handleFinish = async (values: any) => {
    const data: CreateLeaveRequestDTO = {
      leave_type: values.leave_type,
      duration_type: values.duration_type,
      start_date: dayjs(values.start_date).format('YYYY-MM-DD'),
      end_date: values.end_date ? dayjs(values.end_date).format('YYYY-MM-DD') : undefined,
      reason: values.reason
    }

    createMutation(data)
  }

  return (
    <ProForm
      onFinish={handleFinish}
      submitter={{
        searchConfig: {
          submitText: 'Nộp đơn',
          resetText: 'Đặt lại'
        }
      }}
      loading={isPending}
      initialValues={{
        duration_type: DurationType.FULL_DAY
      }}
    >
      <ProFormSelect
        name="leave_type"
        label="Loại nghỉ phép"
        placeholder="Chọn loại nghỉ phép"
        options={[
          { label: 'Nghỉ phép năm', value: LeaveType.ANNUAL },
          { label: 'Nghỉ ốm', value: LeaveType.SICK },
          { label: 'Nghỉ cá nhân', value: LeaveType.PERSONAL },
          { label: 'Khác', value: LeaveType.OTHER }
        ]}
        rules={[{ required: true, message: 'Vui lòng chọn loại nghỉ phép' }]}
      />

      <ProFormRadio.Group
        name="duration_type"
        label="Thời gian nghỉ"
        options={[
          { label: '1 ngày', value: DurationType.FULL_DAY },
          { label: 'Nửa ngày sáng', value: DurationType.HALF_DAY_MORNING },
          { label: 'Nửa ngày chiều', value: DurationType.HALF_DAY_AFTERNOON }
        ]}
        rules={[{ required: true, message: 'Vui lòng chọn thời gian nghỉ' }]}
      />

      <ProFormDatePicker
        name="start_date"
        label="Ngày bắt đầu nghỉ"
        placeholder="Chọn ngày bắt đầu"
        fieldProps={{
          format: 'DD/MM/YYYY',
          disabledDate: (current) => {
            return current && current < dayjs().startOf('day')
          }
        }}
        rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
      />

      <ProFormDatePicker
        name="end_date"
        label="Ngày kết thúc nghỉ"
        placeholder="Chọn ngày kết thúc (tùy chọn)"
        dependencies={['start_date']}
        fieldProps={{
          format: 'DD/MM/YYYY',
          disabledDate: (current) => {
            const startDate = dayjs()
            return current && current < startDate.startOf('day')
          }
        }}
      />

      <ProFormTextArea
        name="reason"
        label="Lý do nghỉ"
        placeholder="Nhập lý do nghỉ (tối thiểu 10 ký tự)"
        fieldProps={{
          rows: 4,
          maxLength: 500,
          showCount: true
        }}
        rules={[
          { required: true, message: 'Vui lòng nhập lý do nghỉ' },
          { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' }
        ]}
      />
    </ProForm>
  )
}
