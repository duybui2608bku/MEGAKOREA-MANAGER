import { ProColumns } from '@ant-design/pro-components'
import type { PostType } from '#src/api/workspace/facebookads/tools/page/index.js'
import { Tag, Typography } from 'antd'
import dayjs from 'dayjs'
import { serviceMegaMainOptions } from '#src/constants/option/index.js'
import TagService from '#src/components/tag/tag-services.js'

const { Link } = Typography

export const getPostColumns = (): ProColumns<PostType>[] => {
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
      title: 'URL Bài Viết',
      dataIndex: 'url',
      ellipsis: true,
      width: 150,
      search: false,
      copyable: true,
      render: (_, record) => (
        <Link href={record.url} target='_blank' ellipsis>
          {record.url}
        </Link>
      ),
      fieldProps: {
        placeholder: 'Tìm kiếm theo URL'
      }
    },
    {
      title: 'Tên Page',
      dataIndex: 'page_name',
      ellipsis: true,
      width: 300,
      copyable: true,
      fieldProps: {
        placeholder: 'Tìm kiếm theo tên page'
      }
    },
    {
      title: 'Page ID',
      dataIndex: 'page_id',
      ellipsis: true,
      width: 120,
      copyable: true,
      fieldProps: {
        placeholder: 'Tìm kiếm theo Page ID'
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
    // {
    //   title: 'Cập nhật',
    //   dataIndex: 'updated_at',
    //   width: 140,
    //   search: false,
    //   render: (_, record) => dayjs(record.updated_at).format('DD/MM/YYYY HH:mm')
    // }
  ]
}
