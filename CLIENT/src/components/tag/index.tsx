import { Tag } from 'antd'
import type { CSSProperties } from 'react'

type GradientType = 'danger' | 'success' | 'info' | 'warning' | 'default'

interface GradientTagProps {
  type?: GradientType
  children?: React.ReactNode
  style?: CSSProperties
  className?: string
}

export const GradientTag = ({ type = 'default', children, style, className, ...rest }: GradientTagProps) => {
  const gradientStyles: Record<GradientType, CSSProperties> = {
    danger: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
    },
    success: {
      background: 'linear-gradient(135deg, #51cf66 0%, #37b24d 100%)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(81, 207, 102, 0.3)'
    },
    info: {
      background: 'linear-gradient(135deg, #4dabf7 0%, #339af0 100%)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(77, 171, 247, 0.3)'
    },
    warning: {
      background: 'linear-gradient(135deg, #ffd43b 0%, #fab005 100%)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(255, 212, 59, 0.3)'
    },
    default: {
      background: 'linear-gradient(135deg, #868e96 0%, #495057 100%)',
      border: 'none',
      color: '#fff',
      boxShadow: '0 4px 12px rgba(134, 142, 150, 0.3)'
    }
  }

  return (
    <Tag
      className={className}
      style={{
        ...gradientStyles[type],
        padding: '6px 16px',
        fontSize: '14px',
        fontWeight: '500',
        borderRadius: '6px',
        transition: 'all 0.3s ease',
        cursor: 'default',
        ...style
      }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
