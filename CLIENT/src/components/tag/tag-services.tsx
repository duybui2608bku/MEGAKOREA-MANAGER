import { Tag } from 'antd'

const serviceColors = {
  Nám: '#1890ff',
  Mày: '#52c41a',
  Môi: '#fa8c16',
  'Hôi nách': '#eb2f96',
  'Giảm béo': '#13c2c2',
  'Nâng cung': '#722ed1',
  'Xóa nhăn': '#ff4d4f',
  'Trị thâm': '#f5222d',
  'Chăm sóc da': '#9254de',
  'Cấy trắng': '#531dab',
  'Triệt lông': '#cf1322',
  default: '#8c8c8c'
}

const TagService = ({ service }: { service: string }) => {
  if (!service) {
    return null
  }

  const color = serviceColors[service as keyof typeof serviceColors] || serviceColors['default']

  return (
    <Tag
      style={{
        background: color,
        color: '#ffffff',
        border: 'none',
        fontWeight: 600,
        borderRadius: '8px',
        padding: '4px 12px',
        fontSize: '13px',
        margin: 0,
        lineHeight: '20px',
        display: 'inline-flex',
        alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
    >
      {service}
    </Tag>
  )
}

export default TagService
