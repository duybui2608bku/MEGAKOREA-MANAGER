import { Modal, Typography, Divider, Space, Tag } from 'antd'
import { ContentTextType } from '#src/api/workspace/facebookads/resource/content-text/index.js'
import dayjs from 'dayjs'
import TagService from '#src/components/tag/tag-services.js'
import styles from './view-content-modal.module.scss'

const { Paragraph, Text } = Typography

interface ViewContentModalProps {
  open: boolean
  onClose: () => void
  contentData: ContentTextType | null
}

export const ViewContentModal = ({ open, onClose, contentData }: ViewContentModalProps) => {
  if (!contentData) return null

  return (
    <Modal title='Chi tiết nội dung' open={open} onCancel={onClose} footer={null} width={800} destroyOnClose>
      <Space direction='vertical' size='middle' className={styles.contentContainer}>
        <div>
          <Text strong className={styles.fieldLabel}>
            Nội dung:
          </Text>
          <Paragraph className={styles.contentWrapper} copyable>
            {contentData.content}
          </Paragraph>
        </div>

        <Divider className={styles.divider} />

        <div className={styles.gridContainer}>
          <div>
            <Text strong>Danh mục:</Text>
            <div className={styles.fieldValue}>
              <Tag color='blue'>{contentData.category}</Tag>
            </div>
          </div>

          <div>
            <Text strong>Chi nhánh:</Text>
            <div className={styles.fieldValue}>
              <Tag color='green'>{contentData.branch}</Tag>
            </div>
          </div>

          <div>
            <Text strong>Dịch vụ:</Text>
            <div className={styles.fieldValue}>
              <TagService service={contentData.services} />
            </div>
          </div>

          <div>
            <Text strong>Ngày tạo:</Text>
            <div className={styles.fieldValue}>
              <Text>{dayjs(contentData.created_at).format('DD/MM/YYYY HH:mm')}</Text>
            </div>
          </div>
        </div>
      </Space>
    </Modal>
  )
}
