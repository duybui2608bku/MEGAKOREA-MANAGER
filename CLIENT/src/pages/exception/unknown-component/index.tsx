import { AppstoreOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Result, Typography } from 'antd'
import { useNavigate } from 'react-router'

const { Paragraph } = Typography

export default function UnknownComponent() {
  const navigate = useNavigate()

  return (
    <Result
      status='warning'
      icon={<AppstoreOutlined />}
      title={'Thành phần không xác định'}
      subTitle={'Không tìm thấy trang'}
      extra={
        <div>
          <Paragraph code copyable={{ text: location.href }}>
            {location.href}
          </Paragraph>
          <Button
            icon={<ArrowLeftOutlined />}
            type='primary'
            onClick={() => {
              navigate(import.meta.env.VITE_BASE_HOME_PATH)
            }}
          >
            {'Quay về trang chủ'}
          </Button>
        </div>
      }
    />
  )
}
