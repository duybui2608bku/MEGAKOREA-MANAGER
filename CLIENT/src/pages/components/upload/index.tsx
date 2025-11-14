import React, { Fragment, useState } from 'react'
import { Upload, message, Spin } from 'antd'
import { InboxOutlined, DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'
import { UPLOAD_CONFIG } from './config'
import { uploadImage } from '#src/api/media/index.js'
import HttpStatusCode from '#src/enum/httpStatusCode.js'

type UploadType = 'image' | 'video' | 'document'

interface UploadComponentProps {
  type?: UploadType
  maxSize?: number
  onUploadSuccess?: (data: any) => void
}

interface FileConfig {
  accept: string
  label: string
  formats: string[]
}

interface UploadedFile {
  uid: string
  name: string
  url: string
  type: 'image' | 'video' | 'document'
  uploadedAt: Date
}

const UploadComponent: React.FC<UploadComponentProps> = ({ type = 'image', maxSize = 50, onUploadSuccess = null }) => {
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const getConfig = (): FileConfig => {
    const configs: Record<UploadType, FileConfig> = {
      image: {
        accept: 'image/*',
        label: 'Hình ảnh',
        formats: UPLOAD_CONFIG.IMAGE_FORMATS
      },
      video: {
        accept: 'video/*',
        label: 'Video',
        formats: UPLOAD_CONFIG.VIDEO_FORMATS
      },
      document: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
        label: 'Tài liệu',
        formats: UPLOAD_CONFIG.DOCUMENT_FORMATS
      }
    }
    return configs[type]
  }

  const config = getConfig()

  const isValidType = (file: File): boolean => {
    return config.formats.some((format) => file.type.includes(format) || file.type === format)
  }

  const createPreviewUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        resolve(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    })
  }

  const handleBeforeUpload = async (file: RcFile): Promise<boolean> => {
    if (!isValidType(file)) {
      message.error(`Chỉ hỗ trợ định dạng: ${config.formats.join(', ')}`)
      return false
    }

    if (file.size > maxSize * 1024 * 1024) {
      message.error(`Kích thước file không được vượt quá ${maxSize}MB`)
      return false
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append(type, file)
      const response = await uploadImage(formData)

      if (response.code !== HttpStatusCode.Ok) {
        throw new Error(response.message)
      }

      const data = response.result[0].url
      const previewUrl = await createPreviewUrl(file)

      const newFile: UploadedFile = {
        uid: file.uid,
        name: file.name,
        url: previewUrl,
        type: type,
        uploadedAt: new Date()
      }

      setUploadedFiles((prev) => [...prev, newFile])
      message.success(`${file.name} đã được tải lên thành công`)

      if (onUploadSuccess) {
        onUploadSuccess(data)
      }
    } catch (error) {
      console.error('Upload error:', error)
      message.error(error instanceof Error ? error.message : 'Lỗi khi upload file')
    } finally {
      setUploading(false)
    }

    return false
  }

  const handleRemove = (uid: string): void => {
    setUploadedFiles((prev) => prev.filter((f) => f.uid !== uid))
    message.success('Đã xóa file')
  }

  const latestFile = uploadedFiles[uploadedFiles.length - 1]

  return (
    <div style={{ width: '100%' }}>
      <Upload.Dragger
        multiple={false}
        beforeUpload={handleBeforeUpload}
        showUploadList={false}
        accept={config.accept}
        disabled={uploading}
        style={{
          marginBottom: '8px',
          padding: latestFile ? '8px' : '12px',
          minHeight: latestFile ? 'auto' : '140px'
        }}
      >
        {uploading ? (
          <div style={{ padding: '24px 0' }}>
            <Spin size='large' />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>Đang tải lên...</p>
          </div>
        ) : latestFile ? (
          <div style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                zIndex: 10,
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              onClick={(e) => {
                e.stopPropagation()
                handleRemove(latestFile.uid)
              }}
            >
              <DeleteOutlined style={{ color: '#fff', fontSize: '12px' }} />
            </div>

            {latestFile.type === 'image' && (
              <div>
                <img
                  src={latestFile.url}
                  alt={latestFile.name}
                  style={{
                    width: '100%',
                    maxHeight: '160px',
                    objectFit: 'contain',
                    borderRadius: '4px'
                  }}
                />
                <div
                  style={{
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                  <span style={{ fontSize: '11px', color: '#666' }}>{latestFile.name}</span>
                </div>
              </div>
            )}

            {latestFile.type === 'video' && (
              <div>
                <video
                  src={latestFile.url}
                  style={{
                    width: '100%',
                    maxHeight: '160px',
                    borderRadius: '4px'
                  }}
                  controls
                />
                <div
                  style={{
                    marginTop: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
                  <span style={{ fontSize: '11px', color: '#666' }}>{latestFile.name}</span>
                </div>
              </div>
            )}

            {latestFile.type === 'document' && (
              <div>
                <div
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    backgroundColor: '#fafafa',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '8px' }}>📄</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#262626',
                      fontWeight: '500',
                      marginBottom: '2px'
                    }}
                  >
                    {latestFile.name}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      color: '#52c41a',
                      fontSize: '11px'
                    }}
                  >
                    <CheckCircleOutlined />
                    <span>Tải lên thành công</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Fragment>
            <p style={{ fontSize: '36px', color: '#1890ff', marginBottom: '4px' }}>
              <InboxOutlined />
            </p>
            <p style={{ fontSize: '14px', marginBottom: '2px' }}>Kéo thả {config.label} vào đây</p>
            <p style={{ fontSize: '11px', color: '#999' }}>hoặc click để chọn file</p>
            <p style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
              Giới hạn: {maxSize}MB | Định dạng: {config.formats.map((f) => f.split('/')[1]).join(', ')}
            </p>
          </Fragment>
        )}
      </Upload.Dragger>
    </div>
  )
}

export default UploadComponent
