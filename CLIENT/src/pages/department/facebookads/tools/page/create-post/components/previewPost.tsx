import React, { useState } from 'react'
import { Row, Col, Avatar, Button, Divider, Image, Typography } from 'antd'
import { AiOutlineLike, AiFillLike, AiOutlineComment, AiOutlineShareAlt, AiOutlineMore } from 'react-icons/ai'
import { FaGlobeAmericas } from 'react-icons/fa'
import AUTHOR_AVATAR from '#src/assets/image/new-logo.png'
import NO_IMAGE from '#src/assets/image/no-image.png'
import './PreviewPost.scss'

interface PreviewPostProps {
  content: string
  image?: string
  authorName?: string
  authorAvatar?: string
  timestamp?: string
}

const AUTHOR_NAME = 'Thẩm Mỹ Viện Quốc Tế Megakorea'
const DEFAULT_LIKE_COUNT = 342
const DEFAULT_COMMENT_COUNT = 8
const DEFAULT_SHARE_COUNT = 3

const PreviewPost: React.FC<PreviewPostProps> = ({
  content,
  image,
  authorName = AUTHOR_NAME,
  authorAvatar = AUTHOR_AVATAR,
  timestamp = '2h'
}) => {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(DEFAULT_LIKE_COUNT)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <div className='preview-post'>
      <Row align='middle' justify='space-between' className='preview-post__header'>
        <Col>
          <Row align='middle' gutter={12}>
            <Col>
              <Avatar size={40} src={authorAvatar} />
            </Col>
            <Col>
              <div className='preview-post__author-name'>{authorName}</div>
              <div className='preview-post__timestamp'>
                {timestamp} · <FaGlobeAmericas size={12} />
              </div>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button type='text' icon={<AiOutlineMore size={20} />} className='preview-post__more-btn' />
        </Col>
      </Row>

      <Row className='preview-post__content'>
        <Col span={24}>
          <Typography.Paragraph ellipsis={{ rows: 2 }} className='preview-post__text'>
            {content}
          </Typography.Paragraph>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Image
            preview={false}
            src={image || NO_IMAGE}
            alt={image ? 'Post content' : 'No image'}
            className='preview-post__image'
          />
        </Col>
      </Row>

      <Row align='middle' justify='space-between' className='preview-post__reactions'>
        <Col>
          <Row align='middle' gutter={6}>
            <Col>
              <div className='preview-post__reaction-icons'>
                <div className='preview-post__reaction-icon preview-post__reaction-icon--like'>
                  <AiFillLike size={10} color='#fff' />
                </div>
                <div className='preview-post__reaction-icon preview-post__reaction-icon--heart'>
                  <span>❤️</span>
                </div>
              </div>
            </Col>
            <Col>
              <span>{likeCount}</span>
            </Col>
          </Row>
        </Col>
        <Col>
          <span>
            {DEFAULT_COMMENT_COUNT} comments · {DEFAULT_SHARE_COUNT} shares
          </span>
        </Col>
      </Row>

      <Divider className='preview-post__divider' />

      <Row className='preview-post__actions'>
        <Col span={8}>
          <Button
            type='text'
            block
            onClick={handleLike}
            className={`preview-post__action-btn ${liked ? 'preview-post__action-btn--liked' : ''}`}
          >
            {liked ? <AiFillLike size={20} /> : <AiOutlineLike size={20} />}
            <span>Like</span>
          </Button>
        </Col>
        <Col span={8}>
          <Button type='text' block className='preview-post__action-btn'>
            <AiOutlineComment size={20} />
            <span>Comment</span>
          </Button>
        </Col>
        <Col span={8}>
          <Button type='text' block className='preview-post__action-btn'>
            <AiOutlineShareAlt size={20} />
            <span>Share</span>
          </Button>
        </Col>
      </Row>
    </div>
  )
}

export default PreviewPost
