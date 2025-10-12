import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router'

export default function Exception404() {
  const navigate = useNavigate()

  const Result404 = (
    <Result
      status='404'
      title='404'
      subTitle='Xin lỗi, trang bạn truy cập không tồn tại.'
      extra={
        <Button
          icon={<ArrowLeftOutlined />}
          type='primary'
          onClick={() => {
            navigate(import.meta.env.VITE_BASE_HOME_PATH)
          }}
        >
          Về trang chủ
        </Button>
      }
    />
  )

  return Result404
}
