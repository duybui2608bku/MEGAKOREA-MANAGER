# Facebook Ads - Page Posts Management

## 📁 Cấu trúc thư mục

```
create-post/
├── tab/
│   ├── components/
│   │   ├── columns-of-list-post.tsx    # Định nghĩa columns cho ProTable
│   │   └── post-modal.tsx              # Modal Create/Edit bài viết
│   ├── create-post.tsx                 # Tab tạo bài viết
│   └── list-posted-of-page.tsx         # Tab danh sách bài viết
├── components/
│   └── previewPost.tsx                 # Preview bài viết
└── index.tsx                           # Main component
```

## 🎯 Tính năng

### Tab: Danh sách bài viết (`list-posted-of-page.tsx`)

#### ✅ Hiển thị danh sách

- **ProTable** từ Ant Design Pro
- Pagination: 10/20/50/100 items per page
- Sorting và filtering
- Search theo nhiều tiêu chí

#### ✅ Columns

1. **STT** - Index tự động
2. **URL** - Link bài viết (copyable, clickable)
3. **Tên Page** - Tên fanpage
4. **Page ID** - ID fanpage (copyable)
5. **Dịch vụ** - Tag màu blue
6. **Ngày tạo** - Format DD/MM/YYYY HH:mm
7. **Cập nhật** - Format DD/MM/YYYY HH:mm
8. **Thao tác** - Edit & Delete buttons

#### ✅ Filters/Search

- **URL**: Tìm kiếm theo URL bài viết
- **Tên Page**: Tìm kiếm theo tên page
- **Page ID**: Tìm kiếm theo Page ID
- **Dịch vụ**: Lọc theo dịch vụ
- **Ngày tạo**: Range picker (từ ngày - đến ngày)

#### ✅ Actions

- **Thêm bài viết**: Mở modal create
- **Sửa**: Mở modal edit với data của row
- **Xóa**: Xác nhận và xóa bài viết
- **Làm mới**: Reset filters

## 🔧 API Integration

### Endpoints được sử dụng

```typescript
// Get all posts with filters
fetchGetAllPosts({
  current: string,
  pageSize: string,
  search: string,      // URL search
  page_name: string,
  page_id: string,
  services: string,
  start_date: string,  // YYYY-MM-DD
  end_date: string     // YYYY-MM-DD
})

// Create post
fetchCreatePost({
  url: string,
  page_name: string,
  page_id: string,
  services: string
})

// Update post
fetchUpdatePost(id: string, {
  url?: string,
  page_name?: string,
  page_id?: string,
  services?: string
})

// Delete post
fetchDeletePost(id: string)
```

### Response Format

**List Response:**

```typescript
{
  code: 200,
  success: true,
  message: string,
  result: {
    list: PostType[],
    total: number,
    current: number
  }
}
```

**Single Response:**

```typescript
{
  code: 200,
  success: true,
  message: string,
  result: PostType
}
```

## 📝 Type Definitions

```typescript
interface PostType {
  _id: string
  url: string
  page_name: string
  page_id: string
  services: string
  created_at: Date
  updated_at: Date
}
```

## 🎨 UI Components

### ProTable Features

- ✅ **Search form**: Collapsed by default, có thể expand
- ✅ **Pagination**: Show total, size changer, quick jumper
- ✅ **Toolbar**: Reload, Density, Settings
- ✅ **Responsive**: Scroll horizontal khi viewport nhỏ
- ✅ **Row key**: `_id`

### Modal Form

- ✅ **Validation**: Required fields, URL format
- ✅ **Layout**: Vertical form
- ✅ **Width**: 600px
- ✅ **Destroy on close**: Reset form khi đóng
- ✅ **Loading states**: Show loading khi submit

## 🚀 Usage Example

```tsx
import { ListPostedOfPage } from './tab/list-posted-of-page'

// In your page
;<Tabs>
  <Tabs.TabPane tab='Danh sách bài viết' key='list'>
    <ListPostedOfPage />
  </Tabs.TabPane>
</Tabs>
```

## 🎯 User Flow

### Create Post

1. Click "Thêm bài viết"
2. Modal mở với form rỗng
3. Nhập thông tin: URL, Tên Page, Page ID, Dịch vụ
4. Click "Tạo mới"
5. Loading → Success message → Table refresh

### Edit Post

1. Click "Sửa" ở row cần edit
2. Modal mở với data của row
3. Sửa thông tin
4. Click "Cập nhật"
5. Loading → Success message → Table refresh

### Delete Post

1. Click "Xóa" ở row cần xóa
2. Popconfirm hiện lên
3. Click "Xác nhận"
4. Loading → Success message → Table refresh

### Search/Filter

1. Expand search form (nếu collapsed)
2. Nhập điều kiện search/filter
3. Table tự động filter khi submit
4. Click "Làm mới" để reset filters

## 📊 Performance

- ✅ **Lazy loading**: Only load current page data
- ✅ **Debounce**: Search có debounce (built-in ProTable)
- ✅ **Memoization**: Columns được memoized
- ✅ **Optimistic updates**: Table reload sau action

## ⚡ Features

### Columns Configuration

- ✅ **Copyable**: URL và Page ID có thể copy
- ✅ **Ellipsis**: Text dài tự động truncate
- ✅ **Width**: Fixed width cho từng column
- ✅ **Search**: Enable/disable search per column
- ✅ **Render**: Custom render cho format

### Table Configuration

- ✅ **Scroll**: { x: 1200 } - horizontal scroll
- ✅ **Options**: reload, density, setting
- ✅ **Header title**: "Danh sách bài viết đã đăng"
- ✅ **Toolbar**: Custom buttons

## 🐛 Error Handling

- ✅ **API errors**: Show error message từ backend
- ✅ **Validation errors**: Form validation với rules
- ✅ **Network errors**: Handled by react-query
- ✅ **Empty state**: ProTable tự handle empty data

## 📱 Responsive

- ✅ **Mobile**: Horizontal scroll
- ✅ **Tablet**: Adaptive columns
- ✅ **Desktop**: Full features

## 🔒 Best Practices

1. ✅ **Type Safety**: Full TypeScript support
2. ✅ **Error Handling**: Try-catch và error messages
3. ✅ **Loading States**: Loading indicators
4. ✅ **User Feedback**: Success/Error messages
5. ✅ **Clean Code**: Separated concerns (columns, modal, table)
6. ✅ **Reusable**: Components có thể reuse
7. ✅ **Accessible**: ARIA labels, keyboard navigation

## 🎉 Ready to Use!

Trang đã sẵn sàng để integrate vào app. Chỉ cần mount component `ListPostedOfPage` vào tab hoặc route.
