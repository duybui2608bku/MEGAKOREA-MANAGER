import { ProColumns } from '@ant-design/pro-components'
import type { ContentTextType } from '#src/api/workspace/facebookads/resource/content-text/index.js'
import { Button, Tooltip } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { serviceMegaMainOptions } from '#src/constants/option/index.js'
import TagService from '#src/components/tag/tag-services.js'

interface GetContentTextColumnsProps {
  onViewContent: (record: ContentTextType) => void
}

export const getContentTextColumns = ({ onViewContent }: GetContentTextColumnsProps): ProColumns<ContentTextType>[] => {
  return [
    {
      dataIndex: 'index',
      title: 'STT',
      valueType: 'indexBorder',
      width: 60,
      align: 'center',
      search: false
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      ellipsis: true,
      width: 300,
      search: false,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {record.content?.substring(0, 100)}
            {record.content?.length > 100 ? '...' : ''}
          </span>
          <Tooltip title='Xem nội dung đầy đủ'>
            <Button
              type='text'
              size='small'
              icon={<EyeOutlined />}
              onClick={() => onViewContent(record)}
              style={{ flexShrink: 0 }}
            />
          </Tooltip>
        </div>
      ),
      fieldProps: {
        placeholder: 'Tìm kiếm theo nội dung'
      }
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      ellipsis: true,
      width: 150,
      fieldProps: {
        placeholder: 'Tìm kiếm theo danh mục'
      }
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      ellipsis: true,
      width: 150,
      fieldProps: {
        placeholder: 'Tìm kiếm theo chi nhánh'
      }
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'services',
      width: 120,
      render: (_, record) => <TagService service={record.services} />,
      fieldProps: {
        placeholder: 'Lọc theo dịch vụ'
      },
      valueEnum: serviceMegaMainOptions.reduce((acc, option) => {
        acc[option.value] = {
          text: option.label
        }
        return acc
      }, {} as Record<string, { text: string }>)
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      width: 100,
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            start_date: value[0] ? dayjs(value[0]).format('YYYY-MM-DD') : undefined,
            end_date: value[1] ? dayjs(value[1]).format('YYYY-MM-DD') : undefined
          }
        }
      },
      render: (_, record) => dayjs(record.created_at).format('DD/MM/YYYY HH:mm')
    }
  ]
}

