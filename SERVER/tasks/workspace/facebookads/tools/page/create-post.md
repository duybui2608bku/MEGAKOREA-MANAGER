# Tính Năng Quản Lý Bài Viết Facebook - Facebook Ads Tools

## Mô Tả

Hệ thống API quản lý thông tin bài viết Facebook theo chuẩn Clean Architecture và Ant Design Pro patterns. API response theo chuẩn `ApiResponse<T>` và `ApiListResponse<T>`.

---

## Cấu Trúc Triển Khai

### 1. ✅ Constants - Messages

**File:** `SERVER/src/constants/messages/workspace/facebookads/page.messages.ts`

Định nghĩa các message responses cho success và error cases.

---

### 2. ✅ Constants - Path Routes

**File:** `SERVER/src/constants/path-routes/workspace/facebookads/page.path-routes.ts`

```typescript
export const FACEBOOKADS_PAGE_PATH_ROUTES = {
  CREATE_POST: '/posts',
  GET_ALL_POSTS: '/posts',
  GET_POST_BY_ID: '/posts/:id',
  UPDATE_POST: '/posts/:id',
  DELETE_POST: '/posts/:id'
}
```

---

### 3. ✅ Interface - Type Definitions

**File:** `SERVER/src/interfaces/workspace/facebookads/page.interface.ts`

```typescript
export interface GetAllPostsQuery {
  current?: string // Trang hiện tại
  pageSize?: string // Số items per page
  search?: string // Search by URL
  page_name?: string // Filter by page name
  page_id?: string // Filter by page ID
  services?: string // Filter by service
  start_date?: string // Filter start date (ISO8601)
  end_date?: string // Filter end date (ISO8601)
}
```

**Note:** Single query interface cho tất cả filters - chuẩn Ant Design Pro

---

### 4. ✅ Repository - Data Access Layer

**File:** `SERVER/src/repository/workspace/facebookads/page.repository.ts`

**Highlights:**

- Sử dụng `generatePagination(current, pageSize)` utility
- Return format: `{ list: T[], total: number, current: number }`
- Tất cả filters trong 1 method duy nhất
- Parallel query với `Promise.all()`

```typescript
async getAllPosts(query: GetAllPostsQuery) {
  const { current, pageSize, search, page_name, page_id, services, start_date, end_date } = query

  const { skip, limit, page } = generatePagination(current, pageSize)

  // Build dynamic filter
  const filter: any = {}
  if (search) filter.url = { $regex: search, $options: 'i' }
  if (page_name) filter.page_name = page_name
  if (page_id) filter.page_id = page_id
  if (services) filter.services = services
  // ... date range

  const [list, total] = await Promise.all([
    PostedOfPage.find(filter).sort({ created_at: -1 }).skip(skip).limit(limit),
    this.getTotalPostsCount(filter)
  ])

  return { list, total, current: page }
}
```

---

### 5. ✅ Service - Business Logic Layer

**File:** `SERVER/src/services/workspace/facebookads/page.service.ts`

**Responsibilities:**

- Validate date range logic
- Check duplicate URLs
- Check post existence
- Delegate to repository

**Clean code:**

- Private methods cho validation
- Clear separation of concerns
- Comprehensive error handling

---

### 6. ✅ Middleware - Validation Layer

**File:** `SERVER/src/middlewares/workspace/facebookads/page.middleware.ts`

**Key Validators:**

- `getAllPostsValidator` - Validates all query params
- `createPostValidator` - Validates post creation
- `updatePostValidator` - Validates post update
- `postIdParamValidator` - Validates MongoDB ObjectId

**Pagination Validation:**

```typescript
current: {
  optional: true,
  isString: true,
  custom: {
    options: async (value) => {
      const current = parseInt(value)
      if (current < 1) throw new ErrorWithStatusCode(...)
    }
  }
}
```

---

### 7. ✅ Controller - HTTP Handler Layer

**File:** `SERVER/src/controllers/workspace/facebookads/page.controller.ts`

**Pattern:**

```typescript
export const getAllPostsController = async (req: Request, res: Response) => {
  const query = req.query as GetAllPostsQuery
  const result = await pageService.getAllPosts(query)
  ResponseSuccess({
    message: PAGE_MESSAGES.GET_POSTS_SUCCESS,
    res,
    result // { list, total, current }
  })
}
```

---

### 8. ✅ Routes - Router Configuration

**File:** `SERVER/src/routes/workspace/facebookads/tools/page/index.ts`

```typescript
// Single endpoint for all queries
facebookadsRoutes.get(
  FACEBOOKADS_PAGE_PATH_ROUTES.GET_ALL_POSTS,
  getAllPostsValidator,
  wrapRequestHandler(getAllPostsController)
)
```

---

## API Endpoints

### POST `/posts`

**Tạo bài viết mới**

**Request Body:**

```json
{
  "url": "https://facebook.com/post/123",
  "page_name": "Example Page",
  "page_id": "123456789",
  "services": "Content Marketing"
}
```

**Response:** `ApiResponse<PostType>`

```json
{
  "code": 200,
  "success": true,
  "message": "Tạo bài viết thành công",
  "result": {
    "_id": "...",
    "url": "...",
    "page_name": "...",
    "page_id": "...",
    "services": "...",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

### GET `/posts`

**Lấy danh sách bài viết với filters**

**Query Parameters:** (tất cả optional)

- `current` - Trang hiện tại (default: 1)
- `pageSize` - Số items per page (default: 10, max: 100)
- `search` - Tìm kiếm theo URL
- `page_name` - Lọc theo tên page
- `page_id` - Lọc theo ID page
- `services` - Lọc theo service
- `start_date` - Lọc từ ngày (ISO8601)
- `end_date` - Lọc đến ngày (ISO8601)

**Examples:**

```
GET /posts?current=1&pageSize=20
GET /posts?page_name=My%20Page&services=SEO
GET /posts?start_date=2024-01-01&end_date=2024-12-31
GET /posts?search=facebook.com&current=2&pageSize=10
```

**Response:** `ApiListResponse<PostType>`

```json
{
  "code": 200,
  "success": true,
  "message": "Lấy danh sách bài viết thành công",
  "result": {
    "list": [
      {
        "_id": "...",
        "url": "...",
        "page_name": "...",
        "page_id": "...",
        "services": "...",
        "created_at": "...",
        "updated_at": "..."
      }
    ],
    "total": 100,
    "current": 1
  }
}
```

---

### GET `/posts/:id`

**Lấy chi tiết 1 bài viết**

**Response:** `ApiResponse<PostType>`

```json
{
  "code": 200,
  "success": true,
  "message": "Lấy thông tin bài viết thành công",
  "result": {
    /* post object */
  }
}
```

---

### PUT `/posts/:id`

**Cập nhật thông tin bài viết**

**Request Body:** (tất cả optional)

```json
{
  "url": "https://facebook.com/post/456",
  "page_name": "Updated Page",
  "page_id": "987654321",
  "services": "SEO"
}
```

**Response:** `ApiResponse<PostType>`

```json
{
  "code": 200,
  "success": true,
  "message": "Cập nhật bài viết thành công",
  "result": {
    /* updated post */
  }
}
```

---

### DELETE `/posts/:id`

**Xóa bài viết**

**Response:** `ApiResponse<void>`

```json
{
  "code": 200,
  "success": true,
  "message": "Xóa bài viết thành công"
}
```

---

## Response Format Standards

### ApiResponse<T>

```typescript
interface ApiResponse<T> {
  code: number
  result: T
  message: string
  success: boolean
}
```

### ApiListResponse<T>

```typescript
interface ApiListResponse<T> extends ApiResponse<T> {
  result: {
    list: T[]
    total: number
    current: number
  }
}
```

---

## Error Handling

**Error Response Format:**

```json
{
  "code": 400,
  "success": false,
  "message": "Error message here"
}
```

**Common Status Codes:**

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `422` - Unprocessable Entity (validation errors)
- `500` - Internal Server Error

---

## Best Practices Implemented

✅ **Clean Architecture** - Tách biệt rõ ràng các layers  
✅ **Single Endpoint Pattern** - 1 endpoint cho tất cả queries (Ant Design Pro style)  
✅ **Standardized Response** - Follow `ApiResponse` và `ApiListResponse`  
✅ **Type Safety** - TypeScript interfaces đầy đủ  
✅ **Pagination Standard** - Dùng `current` và `pageSize` (không phải page/limit)  
✅ **Dynamic Filtering** - Build filter object dynamically  
✅ **Performance** - Parallel queries với Promise.all()  
✅ **Validation** - Input validation trước khi xử lý  
✅ **Error Handling** - Centralized error responses  
✅ **Single Responsibility** - Mỗi file/function có 1 nhiệm vụ  
✅ **DRY Principle** - Reuse validators, error handlers  
✅ **Consistent Naming** - Follow project conventions

---

## Testing

**Base URL:**

```
http://localhost:PORT/api/workspace/facebookads/tools/page
```

**Example Requests:**

1. **Create Post:**

```bash
POST /posts
Content-Type: application/json

{
  "url": "https://facebook.com/test",
  "page_name": "Test Page",
  "page_id": "123",
  "services": "SEO"
}
```

2. **Get All Posts (with filters):**

```bash
GET /posts?current=1&pageSize=10&page_name=Test%20Page&services=SEO
```

3. **Get Posts by Date Range:**

```bash
GET /posts?start_date=2024-01-01&end_date=2024-12-31&current=1&pageSize=20
```

4. **Search Posts:**

```bash
GET /posts?search=facebook&current=1&pageSize=10
```

---

## Migration from Old to New

### Cũ (Multiple Endpoints):

```
GET /posts/by-date
GET /posts/by-service
GET /posts/by-page
GET /posts/stats
```

### Mới (Single Endpoint):

```
GET /posts?start_date=...&end_date=...
GET /posts?services=...
GET /posts?page_name=...&page_id=...
```

**Benefits:**

- Cleaner API surface
- Easier to maintain
- Compatible with Ant Design Pro Table
- Better for frontend pagination
- More flexible filtering

---

## Client API Integration

### Files Created:

1. `CLIENT/src/api/workspace/facebookads/page/types.ts` - Type definitions
2. `CLIENT/src/api/workspace/facebookads/page/path.ts` - API paths
3. `CLIENT/src/api/workspace/facebookads/page/request.ts` - Request functions
4. `CLIENT/src/api/workspace/facebookads/page/index.ts` - Barrel export

### Usage Example:

```typescript
import {
  fetchCreatePost,
  fetchGetAllPosts,
  fetchUpdatePost,
  fetchDeletePost
} from '#src/api/workspace/facebookads/page'

// Create post
const newPost = await fetchCreatePost({
  url: 'https://facebook.com/post/123',
  page_name: 'My Page',
  page_id: '123456',
  services: 'SEO'
})

// Get posts with filters
const posts = await fetchGetAllPosts({
  current: '1',
  pageSize: '10',
  page_name: 'My Page',
  services: 'SEO',
  start_date: '2024-01-01',
  end_date: '2024-12-31'
})

// Update post
const updated = await fetchUpdatePost('post_id', {
  page_name: 'Updated Name'
})

// Delete post
await fetchDeletePost('post_id')
```

### Ant Design Pro Table Integration:

```typescript
import { ProTable } from '@ant-design/pro-components'
import { fetchGetAllPosts, PostType } from '#src/api/workspace/facebookads/page'

<ProTable<PostType>
  request={async (params) => {
    const result = await fetchGetAllPosts({
      current: String(params.current),
      pageSize: String(params.pageSize),
      search: params.search,
      page_name: params.page_name,
      services: params.services,
      start_date: params.start_date,
      end_date: params.end_date
    })
    return {
      data: result.result.list,
      total: result.result.total,
      success: result.success
    }
  }}
  columns={[
    { title: 'URL', dataIndex: 'url' },
    { title: 'Page Name', dataIndex: 'page_name' },
    { title: 'Services', dataIndex: 'services' }
  ]}
/>
```

---

## Trạng Thái: ✅ HOÀN THÀNH

### Backend (SERVER)

- ✅ Response format chuẩn `ApiResponse` / `ApiListResponse`
- ✅ Single endpoint với dynamic filtering
- ✅ Pagination với `current` / `pageSize`
- ✅ Clean code architecture
- ✅ No linter errors
- ✅ Full validation middlewares
- ✅ Error handling chuẩn

### Frontend (CLIENT)

- ✅ TypeScript type definitions
- ✅ API request functions
- ✅ Path constants
- ✅ Ready for Ant Design Pro integration
- ✅ No linter errors

**Total Files:** 13 files (8 backend + 5 frontend + docs)
