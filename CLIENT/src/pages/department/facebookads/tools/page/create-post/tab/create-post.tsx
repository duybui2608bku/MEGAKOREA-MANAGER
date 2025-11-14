import { useMutation } from '@tanstack/react-query'
import { createContentPost, postMultipleOfPage } from '#src/api/webhooks/index.js'
import { FaRegHandPointUp } from 'react-icons/fa'
import { CssGlobal, GlobalEnum } from '#src/enum/global.js'
import { Button, Card, Col, Input, message, Row, Select, Tooltip, Typography } from 'antd'
import { Fragment, useMemo, useState } from 'react'
import { RiGeminiFill } from 'react-icons/ri'
import { methodContentOptions, serviceMegaMainOptions, YesNoOptions } from '#src/constants/option/index.js'
import PreviewPost from '../components/previewPost'
import UploadComponent from '#src/pages/components/upload/index.js'

interface ContentAI {
  method: string
  icon: boolean
  keyword: string
}

interface CreateContentPayload {
  content: string
  services: string
  method: string
  icon: boolean
  keyword: string
}

interface PostMultiplePayload {
  content: string
  url: string
  services: string
}

const MESSAGES = {
  SELECT_SERVICE: 'Vui lòng chọn dịch vụ',
  SELECT_ALL_FIELDS: 'Vui lòng chọn dịch vụ, nội dung và ảnh',
  CREATE_SUCCESS: 'Tạo bài viết thành công',
  CREATE_ERROR: 'Tạo bài viết thất bại',
  POST_MULTIPLE_PENDING: 'Đang đăng bài viết hàng loạt trên fanpage',
  POST_MULTIPLE_SUCCESS: 'Đăng bài viết hàng loạt trên fanpage thành công',
  POST_MULTIPLE_ERROR: 'Đăng bài viết hàng loạt trên fanpage thất bại'
} as const

const INITIAL_CONTENT_AI: ContentAI = {
  method: '',
  icon: false,
  keyword: ''
}

export const CreatePost = () => {
  const [content, setContent] = useState('')
  const [services, setServices] = useState('')
  const [image, setImage] = useState('')
  const [contentAI, setContentAI] = useState<ContentAI>(INITIAL_CONTENT_AI)

  const isFormValid = useMemo(() => Boolean(services && content && image), [services, content, image])

  const isServiceSelected = useMemo(() => Boolean(services), [services])

  const { mutate: createContentPostMutation, isPending: isCreatingContent } = useMutation({
    mutationFn: (payload: CreateContentPayload) => createContentPost(payload),
    onSuccess: (data) => {
      if (data?.result?.content) {
        setContent(data.result.content)
        setContentAI(INITIAL_CONTENT_AI)
        message.success(MESSAGES.CREATE_SUCCESS)
      } else {
        message.error(MESSAGES.CREATE_ERROR)
      }
    },
    onError: () => {
      message.error(MESSAGES.CREATE_ERROR)
    }
  })

  const { mutate: postMultipleOfPageMutation, isPending: isPostingMultiple } = useMutation({
    mutationFn: (payload: PostMultiplePayload) => postMultipleOfPage(payload),
    onSuccess: () => {
      message.success(MESSAGES.POST_MULTIPLE_SUCCESS)
      resetForm()
    },
    onError: () => {
      message.error(MESSAGES.POST_MULTIPLE_ERROR)
    }
  })

  // Handlers
  const handleChangeContentAI = (key: keyof ContentAI, value: any) => {
    setContentAI((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleCreateContentAi = () => {
    if (!isServiceSelected) {
      message.error(MESSAGES.SELECT_SERVICE)
      return
    }

    const payload: CreateContentPayload = {
      content,
      services,
      method: contentAI.method,
      icon: contentAI.icon,
      keyword: contentAI.keyword
    }

    createContentPostMutation(payload)
  }

  const handleCreatePostMultipleOfPage = () => {
    if (!isFormValid) {
      message.error(MESSAGES.SELECT_ALL_FIELDS)
      return
    }

    const payload: PostMultiplePayload = {
      content,
      url: image,
      services
    }

    postMultipleOfPageMutation(payload)
  }

  const handleUploadSuccess = (url: string) => {
    setImage(url)
  }

  const handleServicesChange = (value: string) => {
    setServices(value)
  }

  const resetForm = () => {
    setContent('')
    setServices('')
    setImage('')
    setContentAI(INITIAL_CONTENT_AI)
  }

  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card
            title='Tạo Bài Viết Hàng Loạt Trên Fanpage Theo Dịch Vụ'
            extra={
              <Tooltip title={!isFormValid ? MESSAGES.SELECT_ALL_FIELDS : MESSAGES.POST_MULTIPLE_PENDING}>
                <Button
                  type='primary'
                  disabled={!isFormValid || isPostingMultiple}
                  loading={isPostingMultiple}
                  onClick={handleCreatePostMultipleOfPage}
                  aria-label='Đăng bài viết hàng loạt'
                >
                  <FaRegHandPointUp size={GlobalEnum.ICON_SIZE} className={CssGlobal.CUSOR_POINTER} />
                </Button>
              </Tooltip>
            }
          >
            {/* Service Selection */}
            <Row style={{ marginBottom: 10 }} gutter={[16, 16]}>
              <Col span={24}>
                <Select
                  showSearch
                  allowClear
                  placeholder='Chọn dịch vụ'
                  style={{ width: '100%' }}
                  options={serviceMegaMainOptions}
                  value={services || undefined}
                  onChange={handleServicesChange}
                  aria-label='Chọn dịch vụ'
                />
              </Col>
            </Row>

            {/* AI Content Generation */}
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card
                  title='Tạo nội dung bằng AI'
                  extra={
                    <Tooltip title={!isServiceSelected ? MESSAGES.SELECT_SERVICE : 'Tạo bài viết bằng AI'}>
                      <Button
                        type='primary'
                        disabled={!isServiceSelected || isCreatingContent}
                        loading={isCreatingContent}
                        onClick={handleCreateContentAi}
                        aria-label='Tạo nội dung bằng AI'
                      >
                        <RiGeminiFill size={GlobalEnum.ICON_SIZE} className={CssGlobal.CUSOR_POINTER} />
                      </Button>
                    </Tooltip>
                  }
                >
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Select
                        showSearch
                        allowClear
                        placeholder='Chọn phương pháp'
                        style={{ width: '100%' }}
                        options={methodContentOptions}
                        value={contentAI.method || undefined}
                        onChange={(value) => handleChangeContentAI('method', value)}
                        aria-label='Chọn phương pháp'
                      />
                    </Col>
                    <Col span={12}>
                      <Select
                        showSearch
                        allowClear
                        placeholder='Emoji'
                        style={{ width: '100%' }}
                        options={YesNoOptions}
                        value={contentAI.icon || undefined}
                        onChange={(value) => handleChangeContentAI('icon', value)}
                        aria-label='Chọn emoji'
                      />
                    </Col>
                    <Col span={24}>
                      <Input.TextArea
                        allowClear
                        placeholder='Thông tin thêm'
                        value={contentAI.keyword}
                        onChange={(e) => handleChangeContentAI('keyword', e.target.value)}
                        rows={3}
                        aria-label='Thông tin thêm'
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>

            {/* Image Upload */}
            <Row gutter={[16, 16]} style={{ padding: 10 }}>
              <Col span={24}>
                <UploadComponent type='image' onUploadSuccess={handleUploadSuccess} />
              </Col>
            </Row>

            {/* Content Editor */}
            <Typography.Title style={{ marginTop: 10 }} level={5}>
              Nội dung bài viết
            </Typography.Title>
            <Input.TextArea
              style={{ minHeight: 100 }}
              allowClear
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder='Nhập nội dung bài viết'
              rows={6}
              aria-label='Nội dung bài viết'
            />
          </Card>
        </Col>

        {/* Preview Panel */}
        <Col span={8}>
          <Card title='Bản xem trước'>
            <PreviewPost content={content} image={image} />
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}
