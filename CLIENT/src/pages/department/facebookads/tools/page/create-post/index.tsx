import { Tabs } from 'antd'
import { CreatePost } from './tab/create-post'
import { ListPostedOfPage } from './tab/list-posted-of-page'
import { Instruct } from './tab/instruct'

const FacebookAdsToolsPage = () => {
  const items = [
    {
      key: 'create-post',
      label: 'Tạo bài viết',
      children: <CreatePost />
    },
    {
      key: 'list-posted-of-page',
      label: 'Danh sách bài viết',
      children: <ListPostedOfPage />
    },
    {
      key: 'instruct',
      label: 'Hướng dẫn',
      children: <Instruct />
    }
  ]

  return (
    <Tabs
      items={items}
      style={{
        padding: 20,
        background: 'white'
      }}
    />
  )
}

export default FacebookAdsToolsPage
