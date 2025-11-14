# TÀI LIỆU THIẾT KẾ TÍNH NĂNG: NỘP ĐƠN XIN NGHỈ PHÉP

**Ngày tạo**: 2025-11-14
**Phiên bản**: 1.0
**Dự án**: MEGAKOREA-MANAGER

---

## 📋 MỤC LỤC

1. [Tổng Quan](#1-tổng-quan)
2. [Yêu Cầu Chức Năng](#2-yêu-cầu-chức-năng)
3. [Thiết Kế Database](#3-thiết-kế-database)
4. [Thiết Kế Backend API](#4-thiết-kế-backend-api)
5. [Thiết Kế Frontend](#5-thiết-kế-frontend)
6. [Quy Trình Nghiệp Vụ](#6-quy-trình-nghiệp-vụ)
7. [Phân Quyền](#7-phân-quyền)
8. [Danh Sách File Cần Implement](#8-danh-sách-file-cần-implement)

---

## 1. TỔNG QUAN

### 1.1. Mục Đích
Xây dựng tính năng cho phép nhân viên nộp đơn xin nghỉ phép và cho phép Leader bộ phận hoặc Admin duyệt/từ chối đơn.

### 1.2. Phạm Vi
- **Người dùng**: Tất cả nhân viên trong hệ thống
- **Người duyệt**:
  - Leader của bộ phận (role: MANAGER trong cùng department)
  - Admin (role: ADMIN)

### 1.3. Các Tính Năng Chính
1. ✅ Nhân viên tạo đơn xin nghỉ phép (1 ngày hoặc nửa ngày)
2. ✅ Nhân viên xem danh sách đơn của mình
3. ✅ Leader/Admin xem danh sách đơn cần duyệt
4. ✅ Leader/Admin duyệt/từ chối đơn
5. ✅ Thông báo trạng thái đơn

---

## 2. YÊU CẦU CHỨC NĂNG

### 2.1. Tạo Đơn Nghỉ Phép (Employee)

**Actor**: Nhân viên (bất kỳ role nào)

**Input**:
- Loại nghỉ (leave_type):
  - `annual` - Nghỉ phép năm
  - `sick` - Nghỉ ốm
  - `personal` - Nghỉ cá nhân
  - `other` - Khác
- Thời gian nghỉ (duration_type):
  - `full_day` - 1 ngày
  - `half_day_morning` - Nửa ngày sáng
  - `half_day_afternoon` - Nửa ngày chiều
- Ngày bắt đầu (start_date): Date
- Ngày kết thúc (end_date): Date (tùy chọn, mặc định = start_date)
- Lý do (reason): String (bắt buộc, tối thiểu 10 ký tự)

**Validation**:
- `start_date` không được là ngày quá khứ (trừ khi là Admin)
- `end_date` >= `start_date`
- Không được tạo đơn trùng ngày với đơn đã APPROVED
- `reason` là bắt buộc và phải >= 10 ký tự

**Output**:
- Tạo đơn với status = `PENDING`
- Trả về thông tin đơn vừa tạo

---

### 2.2. Xem Danh Sách Đơn Của Tôi (My Requests)

**Actor**: Nhân viên

**Features**:
- Hiển thị tất cả đơn của user hiện tại
- Filter theo:
  - Trạng thái (PENDING, APPROVED, REJECTED, CANCELLED)
  - Loại nghỉ
  - Khoảng thời gian
- Sắp xếp: Mới nhất trước
- Phân trang: 10 items/page

**Columns**:
- Mã đơn (auto-generated: LR-YYYYMMDD-XXXX)
- Loại nghỉ
- Thời gian nghỉ
- Số ngày nghỉ
- Lý do
- Trạng thái
- Người duyệt (nếu có)
- Ngày duyệt (nếu có)
- Thao tác:
  - Hủy đơn (nếu PENDING)
  - Xem chi tiết

---

### 2.3. Xem Danh Sách Đơn Cần Duyệt (For Approval)

**Actor**:
- Manager: Chỉ xem đơn của nhân viên trong cùng department
- Admin: Xem tất cả đơn

**Features**:
- Hiển thị đơn có status = PENDING
- Filter theo:
  - Bộ phận (Admin only)
  - Loại nghỉ
  - Nhân viên
  - Khoảng thời gian
- Sắp xếp: Cũ nhất trước (FIFO)
- Phân trang: 20 items/page

**Columns**:
- Mã đơn
- Tên nhân viên
- Bộ phận
- Loại nghỉ
- Thời gian nghỉ
- Số ngày nghỉ
- Lý do
- Ngày nộp
- Thao tác:
  - Duyệt
  - Từ chối

---

### 2.4. Duyệt/Từ Chối Đơn

**Actor**: Manager (cùng department) hoặc Admin

**Duyệt Đơn**:
- Input:
  - `leave_request_id`
  - `note` (tùy chọn)
- Validation:
  - Đơn phải có status = PENDING
  - Manager chỉ duyệt đơn của nhân viên trong department của mình
  - Không duyệt đơn của chính mình (trừ Admin)
- Output:
  - Cập nhật status = APPROVED
  - Lưu approver = user_id của người duyệt
  - Lưu approved_at = thời gian hiện tại
  - Lưu approval_note (nếu có)

**Từ Chối Đơn**:
- Input:
  - `leave_request_id`
  - `rejection_reason` (bắt buộc)
- Validation:
  - Đơn phải có status = PENDING
  - `rejection_reason` là bắt buộc
- Output:
  - Cập nhật status = REJECTED
  - Lưu approver = user_id
  - Lưu rejected_at = thời gian hiện tại
  - Lưu rejection_reason

---

### 2.5. Hủy Đơn

**Actor**: Nhân viên (chủ đơn)

**Input**: `leave_request_id`

**Validation**:
- Chỉ chủ đơn mới được hủy
- Chỉ hủy được đơn có status = PENDING

**Output**:
- Cập nhật status = CANCELLED
- Lưu cancelled_at = thời gian hiện tại

---

## 3. THIẾT KẾ DATABASE

### 3.1. Collection: leave_requests

**File**: `SERVER/src/models/request/leave/index.ts`

```typescript
import mongoose from 'mongoose'

const leaveRequestSchema = new mongoose.Schema(
  {
    // Mã đơn tự động (LR-YYYYMMDD-XXXX)
    request_code: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    // Người nộp đơn
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true
    },

    // Loại nghỉ
    leave_type: {
      type: String,
      enum: ['annual', 'sick', 'personal', 'other'],
      required: true,
      index: true
    },

    // Loại thời gian nghỉ
    duration_type: {
      type: String,
      enum: ['full_day', 'half_day_morning', 'half_day_afternoon'],
      required: true,
      default: 'full_day'
    },

    // Ngày bắt đầu nghỉ
    start_date: {
      type: Date,
      required: true,
      index: true
    },

    // Ngày kết thúc nghỉ
    end_date: {
      type: Date,
      required: true
    },

    // Tổng số ngày nghỉ (tính tự động)
    total_days: {
      type: Number,
      required: true,
      default: 1
    },

    // Lý do nghỉ
    reason: {
      type: String,
      required: true,
      minlength: 10
    },

    // Trạng thái đơn
    status: {
      type: Number,
      enum: [1, 2, 3, 4], // PENDING=1, APPROVED=2, REJECTED=3, CANCELLED=4
      default: 1,
      index: true
    },

    // Người duyệt
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      default: null
    },

    // Thời gian duyệt
    approved_at: {
      type: Date,
      default: null
    },

    // Thời gian từ chối
    rejected_at: {
      type: Date,
      default: null
    },

    // Thời gian hủy
    cancelled_at: {
      type: Date,
      default: null
    },

    // Ghi chú khi duyệt
    approval_note: {
      type: String,
      default: null
    },

    // Lý do từ chối
    rejection_reason: {
      type: String,
      default: null
    },

    // Timestamps
    created_at: {
      type: Date,
      default: Date.now,
      index: true
    },

    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'leave_requests',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// Index compound để tối ưu query
leaveRequestSchema.index({ user: 1, status: 1 })
leaveRequestSchema.index({ status: 1, created_at: -1 })
leaveRequestSchema.index({ start_date: 1, end_date: 1 })

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema)
export default LeaveRequest
```

---

### 3.2. Enums

**File**: `SERVER/src/constants/enum/leave/leave.enum.ts`

```typescript
// Loại nghỉ phép
export enum LeaveType {
  ANNUAL = 'annual',        // Nghỉ phép năm
  SICK = 'sick',            // Nghỉ ốm
  PERSONAL = 'personal',    // Nghỉ cá nhân
  OTHER = 'other'           // Khác
}

// Loại thời gian nghỉ
export enum DurationType {
  FULL_DAY = 'full_day',                    // 1 ngày
  HALF_DAY_MORNING = 'half_day_morning',    // Nửa ngày sáng
  HALF_DAY_AFTERNOON = 'half_day_afternoon' // Nửa ngày chiều
}

// Trạng thái đơn
export enum LeaveRequestStatus {
  PENDING = 1,    // Chờ duyệt
  APPROVED = 2,   // Đã duyệt
  REJECTED = 3,   // Từ chối
  CANCELLED = 4   // Đã hủy
}

// Labels hiển thị
export const LeaveTypeLabels: Record<LeaveType, string> = {
  [LeaveType.ANNUAL]: 'Nghỉ phép năm',
  [LeaveType.SICK]: 'Nghỉ ốm',
  [LeaveType.PERSONAL]: 'Nghỉ cá nhân',
  [LeaveType.OTHER]: 'Khác'
}

export const DurationTypeLabels: Record<DurationType, string> = {
  [DurationType.FULL_DAY]: '1 ngày',
  [DurationType.HALF_DAY_MORNING]: 'Nửa ngày sáng',
  [DurationType.HALF_DAY_AFTERNOON]: 'Nửa ngày chiều'
}

export const LeaveRequestStatusLabels: Record<number, string> = {
  [LeaveRequestStatus.PENDING]: 'Chờ duyệt',
  [LeaveRequestStatus.APPROVED]: 'Đã duyệt',
  [LeaveRequestStatus.REJECTED]: 'Từ chối',
  [LeaveRequestStatus.CANCELLED]: 'Đã hủy'
}
```

---

## 4. THIẾT KẾ BACKEND API

### 4.1. Routes Structure

**File**: `SERVER/src/routes/request/leave/index.ts`

```typescript
import { Router } from 'express'
import {
  createLeaveRequestController,
  getMyLeaveRequestsController,
  getPendingLeaveRequestsController,
  getLeaveRequestByIdController,
  approveLeaveRequestController,
  rejectLeaveRequestController,
  cancelLeaveRequestController,
  getLeaveRequestStatsController
} from '~/controllers/request/leave'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import {
  createLeaveRequestValidator,
  approveLeaveRequestValidator,
  rejectLeaveRequestValidator,
  cancelLeaveRequestValidator
} from '~/middlewares/request/leave'
import { requireRoles } from '~/middlewares/auth/authorization.middleware'
import { PermissionRoles } from '~/constants/enum/permision/permission.enum'

const leaveRequestRoutes = Router()

// Tất cả routes đều cần authentication
leaveRequestRoutes.use(accessTokenValidator)

// Employee routes - Ai cũng có thể tạo và xem đơn của mình
leaveRequestRoutes.post(
  '/create',
  createLeaveRequestValidator,
  wrapRequestHandler(createLeaveRequestController)
)

leaveRequestRoutes.get(
  '/my-requests',
  wrapRequestHandler(getMyLeaveRequestsController)
)

leaveRequestRoutes.get(
  '/my-stats',
  wrapRequestHandler(getLeaveRequestStatsController)
)

leaveRequestRoutes.get(
  '/:id',
  wrapRequestHandler(getLeaveRequestByIdController)
)

leaveRequestRoutes.patch(
  '/cancel/:id',
  cancelLeaveRequestValidator,
  wrapRequestHandler(cancelLeaveRequestController)
)

// Manager/Admin routes - Xem và duyệt đơn
leaveRequestRoutes.get(
  '/pending/list',
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  wrapRequestHandler(getPendingLeaveRequestsController)
)

leaveRequestRoutes.patch(
  '/approve/:id',
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  approveLeaveRequestValidator,
  wrapRequestHandler(approveLeaveRequestController)
)

leaveRequestRoutes.patch(
  '/reject/:id',
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  rejectLeaveRequestValidator,
  wrapRequestHandler(rejectLeaveRequestController)
)

export default leaveRequestRoutes
```

---

### 4.2. API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/leave/create` | ✅ | All | Tạo đơn nghỉ phép |
| GET | `/leave/my-requests` | ✅ | All | Xem đơn của tôi |
| GET | `/leave/my-stats` | ✅ | All | Thống kê đơn của tôi |
| GET | `/leave/:id` | ✅ | All | Xem chi tiết đơn |
| PATCH | `/leave/cancel/:id` | ✅ | All | Hủy đơn (chủ đơn) |
| GET | `/leave/pending/list` | ✅ | Manager/Admin | Xem đơn chờ duyệt |
| PATCH | `/leave/approve/:id` | ✅ | Manager/Admin | Duyệt đơn |
| PATCH | `/leave/reject/:id` | ✅ | Manager/Admin | Từ chối đơn |

---

### 4.3. Request/Response Examples

#### 4.3.1. POST /leave/create

**Request Body**:
```json
{
  "leave_type": "annual",
  "duration_type": "full_day",
  "start_date": "2025-11-20",
  "end_date": "2025-11-22",
  "reason": "Về quê thăm gia đình dịp cuối tuần"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Tạo đơn nghỉ phép thành công",
  "result": {
    "_id": "673c1234567890abcdef1234",
    "request_code": "LR-20251114-0001",
    "user": {
      "_id": "673c...",
      "name": "Nguyễn Văn A",
      "department": {
        "_id": "673c...",
        "name": "Phòng IT"
      }
    },
    "leave_type": "annual",
    "duration_type": "full_day",
    "start_date": "2025-11-20T00:00:00.000Z",
    "end_date": "2025-11-22T00:00:00.000Z",
    "total_days": 3,
    "reason": "Về quê thăm gia đình dịp cuối tuần",
    "status": 1,
    "created_at": "2025-11-14T08:30:00.000Z"
  }
}
```

---

#### 4.3.2. GET /leave/my-requests

**Query Parameters**:
- `current`: Page number (default: 1)
- `pageSize`: Items per page (default: 10)
- `status`: Filter by status (1,2,3,4)
- `leave_type`: Filter by type
- `start_date`: Filter from date
- `end_date`: Filter to date

**Response**:
```json
{
  "success": true,
  "message": "Lấy danh sách đơn thành công",
  "result": {
    "list": [
      {
        "_id": "673c...",
        "request_code": "LR-20251114-0001",
        "leave_type": "annual",
        "duration_type": "full_day",
        "start_date": "2025-11-20T00:00:00.000Z",
        "end_date": "2025-11-22T00:00:00.000Z",
        "total_days": 3,
        "reason": "Về quê thăm gia đình",
        "status": 1,
        "approver": null,
        "created_at": "2025-11-14T08:30:00.000Z"
      }
    ],
    "total": 15,
    "current": 1
  }
}
```

---

#### 4.3.3. PATCH /leave/approve/:id

**Request Body**:
```json
{
  "approval_note": "Đồng ý cho nghỉ"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Duyệt đơn thành công",
  "result": {
    "_id": "673c...",
    "request_code": "LR-20251114-0001",
    "status": 2,
    "approver": {
      "_id": "673c...",
      "name": "Trần Thị B"
    },
    "approved_at": "2025-11-14T09:00:00.000Z",
    "approval_note": "Đồng ý cho nghỉ"
  }
}
```

---

#### 4.3.4. PATCH /leave/reject/:id

**Request Body**:
```json
{
  "rejection_reason": "Dự án đang gấp, không thể nghỉ vào thời điểm này"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Từ chối đơn thành công",
  "result": {
    "_id": "673c...",
    "request_code": "LR-20251114-0001",
    "status": 3,
    "approver": {
      "_id": "673c...",
      "name": "Trần Thị B"
    },
    "rejected_at": "2025-11-14T09:00:00.000Z",
    "rejection_reason": "Dự án đang gấp, không thể nghỉ vào thời điểm này"
  }
}
```

---

### 4.4. Service Layer Logic

**File**: `SERVER/src/services/request/leave/index.ts`

**Key Methods**:

```typescript
class LeaveRequestService {
  // Tạo đơn
  async createLeaveRequest(userId: string, data: CreateLeaveRequestDTO) {
    // 1. Validate dates
    // 2. Check overlap với đơn đã approved
    // 3. Generate request_code
    // 4. Calculate total_days
    // 5. Create request với status = PENDING
  }

  // Lấy đơn của user
  async getMyLeaveRequests(userId: string, filters: any) {
    // 1. Query by user_id
    // 2. Apply filters (status, leave_type, dates)
    // 3. Populate user, approver
    // 4. Paginate
  }

  // Lấy đơn chờ duyệt (cho Manager/Admin)
  async getPendingLeaveRequests(approverId: string, filters: any) {
    // 1. Get approver info (role, department)
    // 2. If MANAGER: filter by same department
    // 3. If ADMIN: get all
    // 4. Filter status = PENDING
    // 5. Populate user, department
    // 6. Sort by created_at ASC (FIFO)
  }

  // Duyệt đơn
  async approveLeaveRequest(
    requestId: string,
    approverId: string,
    note?: string
  ) {
    // 1. Get request
    // 2. Validate status = PENDING
    // 3. Get approver info
    // 4. If MANAGER: check same department
    // 5. Check không tự duyệt (trừ ADMIN)
    // 6. Update: status=APPROVED, approver, approved_at, approval_note
  }

  // Từ chối đơn
  async rejectLeaveRequest(
    requestId: string,
    approverId: string,
    reason: string
  ) {
    // 1. Get request
    // 2. Validate status = PENDING
    // 3. Validate rejection_reason
    // 4. Get approver info
    // 5. If MANAGER: check same department
    // 6. Update: status=REJECTED, approver, rejected_at, rejection_reason
  }

  // Hủy đơn
  async cancelLeaveRequest(requestId: string, userId: string) {
    // 1. Get request
    // 2. Check ownership (user === userId)
    // 3. Validate status = PENDING
    // 4. Update: status=CANCELLED, cancelled_at
  }

  // Helper: Check overlap
  private async checkOverlap(
    userId: string,
    startDate: Date,
    endDate: Date,
    excludeId?: string
  ): Promise<boolean> {
    // Query đơn đã APPROVED của user
    // Check if date ranges overlap
  }

  // Helper: Generate request code
  private async generateRequestCode(): Promise<string> {
    // Format: LR-YYYYMMDD-XXXX
    // Get count of requests today
    // Increment counter
  }

  // Helper: Calculate total days
  private calculateTotalDays(
    startDate: Date,
    endDate: Date,
    durationType: DurationType
  ): number {
    // If half_day: return 0.5
    // Else: calculate business days between dates
  }
}
```

---

### 4.5. Middleware Validators

**File**: `SERVER/src/middlewares/request/leave/index.ts`

```typescript
import { checkSchema } from 'express-validator'
import { validate } from '~/middlewares/utils/utils.middlewares'

export const createLeaveRequestValidator = validate(
  checkSchema({
    leave_type: {
      in: ['body'],
      isIn: {
        options: [['annual', 'sick', 'personal', 'other']],
        errorMessage: 'Loại nghỉ không hợp lệ'
      }
    },
    duration_type: {
      in: ['body'],
      isIn: {
        options: [['full_day', 'half_day_morning', 'half_day_afternoon']],
        errorMessage: 'Loại thời gian không hợp lệ'
      }
    },
    start_date: {
      in: ['body'],
      isISO8601: {
        errorMessage: 'Ngày bắt đầu không hợp lệ'
      },
      custom: {
        options: (value) => {
          const date = new Date(value)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return date >= today
        },
        errorMessage: 'Ngày bắt đầu không được là ngày quá khứ'
      }
    },
    end_date: {
      in: ['body'],
      optional: true,
      isISO8601: {
        errorMessage: 'Ngày kết thúc không hợp lệ'
      }
    },
    reason: {
      in: ['body'],
      isString: true,
      trim: true,
      isLength: {
        options: { min: 10 },
        errorMessage: 'Lý do phải có ít nhất 10 ký tự'
      }
    }
  }, ['body'])
)

export const approveLeaveRequestValidator = validate(
  checkSchema({
    approval_note: {
      in: ['body'],
      optional: true,
      isString: true,
      trim: true
    }
  }, ['body'])
)

export const rejectLeaveRequestValidator = validate(
  checkSchema({
    rejection_reason: {
      in: ['body'],
      isString: true,
      trim: true,
      notEmpty: {
        errorMessage: 'Lý do từ chối là bắt buộc'
      },
      isLength: {
        options: { min: 10 },
        errorMessage: 'Lý do từ chối phải có ít nhất 10 ký tự'
      }
    }
  }, ['body'])
)

export const cancelLeaveRequestValidator = validate(
  checkSchema({
    id: {
      in: ['params'],
      isMongoId: {
        errorMessage: 'ID không hợp lệ'
      }
    }
  }, ['params'])
)
```

---

## 5. THIẾT KẾ FRONTEND

### 5.1. Folder Structure

```
CLIENT/src/
├── pages/request/leave/
│   ├── index.tsx                    # Main layout (Tab wrapper)
│   ├── my-request/
│   │   └── index.tsx                # Danh sách đơn của tôi
│   ├── create/
│   │   └── index.tsx                # Form tạo đơn mới
│   ├── list/
│   │   └── index.tsx                # Danh sách đơn chờ duyệt (Manager/Admin)
│   └── components/
│       ├── detail-modal.tsx         # Modal xem chi tiết
│       ├── approve-modal.tsx        # Modal duyệt đơn
│       ├── reject-modal.tsx         # Modal từ chối đơn
│       ├── create-form.tsx          # Form tạo đơn
│       └── status-badge.tsx         # Badge hiển thị trạng thái
│
├── api/request/leave/
│   └── index.ts                     # API services
│
└── types/request/leave/
    └── index.ts                     # TypeScript types
```

---

### 5.2. TypeScript Types

**File**: `CLIENT/src/types/request/leave/index.ts`

```typescript
export enum LeaveType {
  ANNUAL = 'annual',
  SICK = 'sick',
  PERSONAL = 'personal',
  OTHER = 'other'
}

export enum DurationType {
  FULL_DAY = 'full_day',
  HALF_DAY_MORNING = 'half_day_morning',
  HALF_DAY_AFTERNOON = 'half_day_afternoon'
}

export enum LeaveRequestStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  CANCELLED = 4
}

export interface LeaveRequestType {
  _id: string
  request_code: string
  user: {
    _id: string
    name: string
    email: string
    department: {
      _id: string
      name: string
    }
  }
  leave_type: LeaveType
  duration_type: DurationType
  start_date: string
  end_date: string
  total_days: number
  reason: string
  status: LeaveRequestStatus
  approver?: {
    _id: string
    name: string
  }
  approved_at?: string
  rejected_at?: string
  cancelled_at?: string
  approval_note?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface CreateLeaveRequestDTO {
  leave_type: LeaveType
  duration_type: DurationType
  start_date: string
  end_date?: string
  reason: string
}

export interface ApproveLeaveRequestDTO {
  approval_note?: string
}

export interface RejectLeaveRequestDTO {
  rejection_reason: string
}
```

---

### 5.3. API Services

**File**: `CLIENT/src/api/request/leave/index.ts`

```typescript
import request from '#src/utils/request'
import type { ApiResponse, ApiListResponse } from '#src/types'
import type {
  LeaveRequestType,
  CreateLeaveRequestDTO,
  ApproveLeaveRequestDTO,
  RejectLeaveRequestDTO
} from '#src/types/request/leave'

const BASE_PATH = '/leave'

// Tạo đơn nghỉ phép
export function createLeaveRequest(data: CreateLeaveRequestDTO) {
  return request.post<ApiResponse<LeaveRequestType>>(
    `${BASE_PATH}/create`,
    { json: data }
  ).json()
}

// Lấy danh sách đơn của tôi
export function fetchMyLeaveRequests(params: any) {
  return request.get<ApiListResponse<LeaveRequestType>>(
    `${BASE_PATH}/my-requests`,
    { searchParams: params }
  ).json()
}

// Lấy thống kê đơn của tôi
export function fetchMyLeaveStats() {
  return request.get<ApiResponse<any>>(
    `${BASE_PATH}/my-stats`
  ).json()
}

// Lấy chi tiết đơn
export function fetchLeaveRequestById(id: string) {
  return request.get<ApiResponse<LeaveRequestType>>(
    `${BASE_PATH}/${id}`
  ).json()
}

// Hủy đơn
export function cancelLeaveRequest(id: string) {
  return request.patch<ApiResponse<LeaveRequestType>>(
    `${BASE_PATH}/cancel/${id}`
  ).json()
}

// Lấy danh sách đơn chờ duyệt (Manager/Admin)
export function fetchPendingLeaveRequests(params: any) {
  return request.get<ApiListResponse<LeaveRequestType>>(
    `${BASE_PATH}/pending/list`,
    { searchParams: params }
  ).json()
}

// Duyệt đơn
export function approveLeaveRequest(id: string, data: ApproveLeaveRequestDTO) {
  return request.patch<ApiResponse<LeaveRequestType>>(
    `${BASE_PATH}/approve/${id}`,
    { json: data }
  ).json()
}

// Từ chối đơn
export function rejectLeaveRequest(id: string, data: RejectLeaveRequestDTO) {
  return request.patch<ApiResponse<LeaveRequestType>>(
    `${BASE_PATH}/reject/${id}`,
    { json: data }
  ).json()
}
```

---

### 5.4. Main Pages

#### 5.4.1. My Requests Page

**File**: `CLIENT/src/pages/request/leave/my-request/index.tsx`

**Features**:
- BasicTable với các columns:
  - Mã đơn
  - Loại nghỉ
  - Thời gian (start - end)
  - Số ngày
  - Trạng thái (Badge với màu sắc)
  - Người duyệt
  - Ngày duyệt
  - Thao tác (Xem chi tiết, Hủy)
- Filter: Trạng thái, Loại nghỉ, Khoảng thời gian
- Button "Tạo đơn mới" → Navigate to /leave/create
- Mutation: Cancel request (chỉ PENDING)

**Columns**:
```typescript
const columns: ProColumns<LeaveRequestType>[] = [
  {
    title: 'Mã đơn',
    dataIndex: 'request_code',
    width: 160,
    fixed: 'left'
  },
  {
    title: 'Loại nghỉ',
    dataIndex: 'leave_type',
    valueType: 'select',
    valueEnum: {
      annual: { text: 'Nghỉ phép năm' },
      sick: { text: 'Nghỉ ốm' },
      personal: { text: 'Nghỉ cá nhân' },
      other: { text: 'Khác' }
    }
  },
  {
    title: 'Thời gian nghỉ',
    key: 'period',
    render: (_, record) =>
      `${dayjs(record.start_date).format('DD/MM/YYYY')} - ${dayjs(record.end_date).format('DD/MM/YYYY')}`
  },
  {
    title: 'Số ngày',
    dataIndex: 'total_days',
    width: 100
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (status) => <StatusBadge status={status} />
  },
  {
    title: 'Người duyệt',
    dataIndex: ['approver', 'name'],
    render: (name) => name || '-'
  },
  {
    title: 'Ngày duyệt',
    dataIndex: 'approved_at',
    render: (date) => date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'
  },
  {
    title: 'Thao tác',
    valueType: 'option',
    fixed: 'right',
    render: (_, record) => [
      <BasicButton onClick={() => handleViewDetail(record)}>
        Chi tiết
      </BasicButton>,
      record.status === LeaveRequestStatus.PENDING && (
        <Popconfirm onConfirm={() => handleCancel(record._id)}>
          <BasicButton danger>Hủy</BasicButton>
        </Popconfirm>
      )
    ]
  }
]
```

---

#### 5.4.2. Create Page

**File**: `CLIENT/src/pages/request/leave/create/index.tsx`

**Features**:
- ProForm với các fields:
  - Loại nghỉ (Select)
  - Loại thời gian (Radio: 1 ngày / Nửa ngày sáng / Nửa ngày chiều)
  - Ngày bắt đầu (DatePicker, disable past dates)
  - Ngày kết thúc (DatePicker, disable dates before start_date)
  - Lý do (TextArea, min 10 chars)
- Validation:
  - Required fields
  - Min length for reason
  - Date logic
- Submit → Mutation → Success → Navigate to /leave/my-request

**Form Structure**:
```typescript
<ProForm
  onFinish={async (values) => {
    await createLeaveRequestMutation.mutateAsync(values)
    navigate('/leave/my-request')
  }}
>
  <ProFormSelect
    name="leave_type"
    label="Loại nghỉ"
    options={[
      { label: 'Nghỉ phép năm', value: 'annual' },
      { label: 'Nghỉ ốm', value: 'sick' },
      { label: 'Nghỉ cá nhân', value: 'personal' },
      { label: 'Khác', value: 'other' }
    ]}
    rules={[{ required: true }]}
  />

  <ProFormRadio.Group
    name="duration_type"
    label="Thời gian nghỉ"
    options={[
      { label: '1 ngày', value: 'full_day' },
      { label: 'Nửa ngày sáng', value: 'half_day_morning' },
      { label: 'Nửa ngày chiều', value: 'half_day_afternoon' }
    ]}
    rules={[{ required: true }]}
  />

  <ProFormDatePicker
    name="start_date"
    label="Ngày bắt đầu"
    rules={[{ required: true }]}
    fieldProps={{
      disabledDate: (current) => current && current < dayjs().startOf('day')
    }}
  />

  <ProFormDatePicker
    name="end_date"
    label="Ngày kết thúc"
    dependencies={['start_date']}
    fieldProps={{
      disabledDate: (current) => {
        const startDate = form.getFieldValue('start_date')
        return current && current < dayjs(startDate)
      }
    }}
  />

  <ProFormTextArea
    name="reason"
    label="Lý do"
    rules={[
      { required: true },
      { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' }
    ]}
    fieldProps={{
      rows: 4,
      maxLength: 500,
      showCount: true
    }}
  />
</ProForm>
```

---

#### 5.4.3. Pending Requests List (Manager/Admin)

**File**: `CLIENT/src/pages/request/leave/list/index.tsx`

**Features**:
- BasicTable với các columns:
  - Mã đơn
  - Nhân viên
  - Bộ phận
  - Loại nghỉ
  - Thời gian
  - Số ngày
  - Lý do
  - Ngày nộp
  - Thao tác (Duyệt, Từ chối)
- Filter: Bộ phận (Admin only), Loại nghỉ, Nhân viên
- Sort: Ngày nộp cũ nhất trước (FIFO)
- Modals: ApproveModal, RejectModal

**Access Control**:
```typescript
const { hasAccessByRoles } = useAccess()

// Chỉ hiện nút "Duyệt" nếu có quyền
{hasAccessByRoles(['admin', 'manager']) && (
  <BasicButton onClick={() => handleApprove(record)}>
    Duyệt
  </BasicButton>
)}
```

---

### 5.5. Components

#### 5.5.1. StatusBadge

**File**: `CLIENT/src/pages/request/leave/components/status-badge.tsx`

```typescript
import { Tag } from 'antd'
import { LeaveRequestStatus } from '#src/types/request/leave'

interface StatusBadgeProps {
  status: LeaveRequestStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    [LeaveRequestStatus.PENDING]: {
      color: 'blue',
      text: 'Chờ duyệt'
    },
    [LeaveRequestStatus.APPROVED]: {
      color: 'green',
      text: 'Đã duyệt'
    },
    [LeaveRequestStatus.REJECTED]: {
      color: 'red',
      text: 'Từ chối'
    },
    [LeaveRequestStatus.CANCELLED]: {
      color: 'default',
      text: 'Đã hủy'
    }
  }

  const { color, text } = config[status]

  return <Tag color={color}>{text}</Tag>
}
```

---

#### 5.5.2. ApproveModal

**File**: `CLIENT/src/pages/request/leave/components/approve-modal.tsx`

```typescript
import { Modal, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { approveLeaveRequest } from '#src/api/request/leave'

interface ApproveModalProps {
  open: boolean
  requestId: string
  onClose: () => void
  onSuccess: () => void
}

export function ApproveModal({
  open,
  requestId,
  onClose,
  onSuccess
}: ApproveModalProps) {
  const [form] = Form.useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => approveLeaveRequest(requestId, data),
    onSuccess: () => {
      message.success('Duyệt đơn thành công')
      onClose()
      onSuccess()
    },
    onError: (error: any) => {
      message.error(`Duyệt đơn thất bại: ${error.message}`)
    }
  })

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate(values)
    })
  }

  return (
    <Modal
      title="Duyệt đơn nghỉ phép"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isPending}
      okText="Xác nhận duyệt"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="approval_note"
          label="Ghi chú (tùy chọn)"
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập ghi chú nếu cần..."
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
```

---

#### 5.5.3. RejectModal

**File**: `CLIENT/src/pages/request/leave/components/reject-modal.tsx`

```typescript
import { Modal, Form, Input, message } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { rejectLeaveRequest } from '#src/api/request/leave'

interface RejectModalProps {
  open: boolean
  requestId: string
  onClose: () => void
  onSuccess: () => void
}

export function RejectModal({
  open,
  requestId,
  onClose,
  onSuccess
}: RejectModalProps) {
  const [form] = Form.useForm()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => rejectLeaveRequest(requestId, data),
    onSuccess: () => {
      message.success('Từ chối đơn thành công')
      onClose()
      onSuccess()
    },
    onError: (error: any) => {
      message.error(`Từ chối đơn thất bại: ${error.message}`)
    }
  })

  const handleOk = () => {
    form.validateFields().then((values) => {
      mutate(values)
    })
  }

  return (
    <Modal
      title="Từ chối đơn nghỉ phép"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isPending}
      okText="Xác nhận từ chối"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="rejection_reason"
          label="Lý do từ chối"
          rules={[
            { required: true, message: 'Vui lòng nhập lý do từ chối' },
            { min: 10, message: 'Lý do phải có ít nhất 10 ký tự' }
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập lý do từ chối..."
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
```

---

## 6. QUY TRÌNH NGHIỆP VỤ

### 6.1. Luồng Tạo Đơn

```
┌─────────────┐
│  Nhân viên  │
└──────┬──────┘
       │
       │ 1. Vào trang "Tạo đơn nghỉ phép"
       ▼
┌─────────────────────────────┐
│  Điền form tạo đơn          │
│  - Loại nghỉ                │
│  - Thời gian nghỉ           │
│  - Ngày bắt đầu/kết thúc    │
│  - Lý do                    │
└──────────┬──────────────────┘
           │
           │ 2. Submit form
           ▼
┌─────────────────────────────┐
│  Frontend Validation        │
│  - Required fields          │
│  - Date logic               │
│  - Min length reason        │
└──────────┬──────────────────┘
           │
           │ 3. POST /leave/create
           ▼
┌─────────────────────────────┐
│  Backend Validation         │
│  - Date không quá khứ       │
│  - end_date >= start_date   │
│  - Không trùng approved     │
└──────────┬──────────────────┘
           │
           │ 4. Generate request_code
           │ 5. Calculate total_days
           ▼
┌─────────────────────────────┐
│  Tạo record trong DB        │
│  - status = PENDING (1)     │
│  - user = current_user_id   │
└──────────┬──────────────────┘
           │
           │ 6. Return created request
           ▼
┌─────────────────────────────┐
│  Frontend: Success message  │
│  Navigate to /my-requests   │
└─────────────────────────────┘
```

---

### 6.2. Luồng Duyệt Đơn (Manager)

```
┌────────────┐
│  Manager   │
└─────┬──────┘
      │
      │ 1. Vào trang "Đơn chờ duyệt"
      ▼
┌──────────────────────────────────┐
│  GET /leave/pending/list         │
│  Query:                          │
│  - status = PENDING              │
│  - department = manager.dept     │
└──────────┬───────────────────────┘
           │
           │ 2. Hiển thị danh sách đơn của nhân viên cùng bộ phận
           ▼
┌──────────────────────────────────┐
│  Manager xem chi tiết đơn        │
│  - Thông tin nhân viên           │
│  - Lý do nghỉ                    │
│  - Thời gian                     │
└──────────┬───────────────────────┘
           │
           │ 3a. Click "Duyệt"           3b. Click "Từ chối"
           ▼                              ▼
┌─────────────────────┐          ┌─────────────────────┐
│  Approve Modal      │          │  Reject Modal       │
│  - Nhập ghi chú     │          │  - Nhập lý do       │
│    (optional)       │          │    (required)       │
└──────┬──────────────┘          └──────┬──────────────┘
       │                                 │
       │ PATCH /approve/:id              │ PATCH /reject/:id
       ▼                                 ▼
┌─────────────────────┐          ┌─────────────────────┐
│  Backend validate   │          │  Backend validate   │
│  - Manager cùng dept│          │  - Manager cùng dept│
│  - status = PENDING │          │  - status = PENDING │
│  - Không tự duyệt   │          │  - rejection_reason │
└──────┬──────────────┘          └──────┬──────────────┘
       │                                 │
       │ Update DB:                      │ Update DB:
       │ - status = APPROVED             │ - status = REJECTED
       │ - approver = manager_id         │ - approver = manager_id
       │ - approved_at = now             │ - rejected_at = now
       │ - approval_note                 │ - rejection_reason
       ▼                                 ▼
┌─────────────────────┐          ┌─────────────────────┐
│  Success message    │          │  Success message    │
│  Reload table       │          │  Reload table       │
└─────────────────────┘          └─────────────────────┘
```

---

### 6.3. Quyền Duyệt Đơn

**Manager (role: MANAGER)**:
- ✅ Xem đơn của nhân viên trong **cùng bộ phận**
- ✅ Duyệt/Từ chối đơn của nhân viên trong **cùng bộ phận**
- ❌ Không duyệt đơn của nhân viên **khác bộ phận**
- ❌ Không duyệt đơn của **chính mình**

**Admin (role: ADMIN)**:
- ✅ Xem **tất cả** đơn
- ✅ Duyệt/Từ chối **tất cả** đơn
- ✅ Duyệt đơn của **chính mình**
- ✅ Bỏ qua các ràng buộc về bộ phận

**Implementation trong Service**:
```typescript
async approveLeaveRequest(requestId: string, approverId: string) {
  const request = await this.getRequestById(requestId)
  const approver = await User.findById(approverId).populate('roles')

  // Check if approver has ADMIN role
  const isAdmin = approver.roles.some(role => role.code === 'admin')

  if (!isAdmin) {
    // Manager can only approve requests from same department
    const requestUser = await User.findById(request.user)

    if (requestUser.department.toString() !== approver.department.toString()) {
      throw new Error('Bạn chỉ có thể duyệt đơn của nhân viên trong bộ phận của mình')
    }

    // Manager cannot approve their own request
    if (request.user.toString() === approverId) {
      throw new Error('Bạn không thể tự duyệt đơn của mình')
    }
  }

  // Proceed with approval...
}
```

---

## 7. PHÂN QUYỀN

### 7.1. Permission Codes

**File**: `SERVER/src/constants/enum/leave/leave.permission.ts`

```typescript
export enum LeavePermissionCodes {
  // Employee permissions (tất cả user đều có)
  CREATE = 'leave:request:create',
  VIEW_OWN = 'leave:request:view_own',
  CANCEL = 'leave:request:cancel',

  // Manager/Admin permissions
  VIEW_PENDING = 'leave:request:view_pending',
  APPROVE = 'leave:request:approve',
  REJECT = 'leave:request:reject',

  // Admin only
  VIEW_ALL = 'leave:request:view_all',
  DELETE = 'leave:request:delete'
}
```

---

### 7.2. Route Protection

**Backend**:
```typescript
// Employee routes - Không cần role check
leaveRequestRoutes.post('/create', accessTokenValidator, ...)
leaveRequestRoutes.get('/my-requests', accessTokenValidator, ...)

// Manager/Admin routes - Cần role check
leaveRequestRoutes.get(
  '/pending/list',
  accessTokenValidator,
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  ...
)
```

**Frontend**:
```typescript
// Router config
{
  path: '/leave',
  children: [
    {
      path: 'my-request',
      Component: MyRequestPage,
      // Tất cả user đều access được
    },
    {
      path: 'create',
      Component: CreatePage,
      // Tất cả user đều access được
    },
    {
      path: 'list',
      Component: PendingListPage,
      handle: {
        roles: ['admin', 'manager']
      }
    }
  ]
}
```

---

### 7.3. UI Access Control

```typescript
// Trong component
const { hasAccessByRoles } = useAccess()

// Hiển thị tab "Đơn chờ duyệt" chỉ cho Manager/Admin
{hasAccessByRoles(['admin', 'manager']) && (
  <Tabs.TabPane key="pending" tab="Đơn chờ duyệt">
    <PendingList />
  </Tabs.TabPane>
)}

// Disable nút "Duyệt" nếu không có quyền
<BasicButton
  disabled={!hasAccessByRoles(['admin', 'manager'])}
  onClick={handleApprove}
>
  Duyệt
</BasicButton>
```

---

## 8. DANH SÁCH FILE CẦN IMPLEMENT

### 8.1. Backend Files

#### Constants & Enums
- ✅ `SERVER/src/constants/enum/leave/leave.enum.ts` - Enums và labels
- ✅ `SERVER/src/constants/enum/leave/leave.permission.ts` - Permission codes
- ✅ `SERVER/src/constants/messages/leave/leave.messages.ts` - Messages
- ✅ `SERVER/src/constants/path-routes/leave/leave.path-routes.ts` - Path constants

#### Database
- ✅ `SERVER/src/models/request/leave/index.ts` - Mongoose schema
- ✅ `SERVER/src/repository/request/leave/index.ts` - Database queries

#### Business Logic
- ✅ `SERVER/src/services/request/leave/index.ts` - Service layer
- ✅ `SERVER/src/controllers/request/leave/index.ts` - Controllers

#### Middleware & Validation
- ✅ `SERVER/src/middlewares/request/leave/index.ts` - Validators

#### Routes
- ✅ `SERVER/src/routes/request/leave/index.ts` - Route definitions

#### Types
- ✅ `SERVER/src/interfaces/leave/leave.interface.ts` - TypeScript interfaces

---

### 8.2. Frontend Files

#### Types
- ✅ `CLIENT/src/types/request/leave/index.ts` - TypeScript types

#### API
- ✅ `CLIENT/src/api/request/leave/index.ts` - API service functions
- ✅ `CLIENT/src/constants/api/leave.ts` - API path constants

#### Pages
- ✅ `CLIENT/src/pages/request/leave/index.tsx` - Main layout (Tab container)
- ✅ `CLIENT/src/pages/request/leave/my-request/index.tsx` - Đơn của tôi
- ✅ `CLIENT/src/pages/request/leave/create/index.tsx` - Tạo đơn mới
- ✅ `CLIENT/src/pages/request/leave/list/index.tsx` - Đơn chờ duyệt

#### Components
- ✅ `CLIENT/src/pages/request/leave/components/detail-modal.tsx` - Modal chi tiết
- ✅ `CLIENT/src/pages/request/leave/components/approve-modal.tsx` - Modal duyệt
- ✅ `CLIENT/src/pages/request/leave/components/reject-modal.tsx` - Modal từ chối
- ✅ `CLIENT/src/pages/request/leave/components/status-badge.tsx` - Badge trạng thái
- ✅ `CLIENT/src/pages/request/leave/components/create-form.tsx` - Form tạo đơn

#### Router
- ✅ `CLIENT/src/router/routes/leave.routes.tsx` - Route definitions

---

### 8.3. Configuration Updates

#### Backend
- ✅ Update `SERVER/src/index.ts` - Mount leave routes
- ✅ Update `SERVER/src/constants/collecttions/name.collecttions.ts` - Add LEAVE_REQUEST
- ✅ Update `.env` - Add LEAVE_REQUEST_COLLECTION_NAME

#### Frontend
- ✅ Update `CLIENT/src/router/index.tsx` - Import leave routes
- ✅ Update menu config - Add "Nghỉ phép" menu item

---

## 9. TESTING CHECKLIST

### 9.1. Backend Testing

**Unit Tests**:
- [ ] Service: createLeaveRequest()
- [ ] Service: checkOverlap()
- [ ] Service: generateRequestCode()
- [ ] Service: calculateTotalDays()
- [ ] Service: approveLeaveRequest() - Manager same dept
- [ ] Service: approveLeaveRequest() - Manager diff dept (should fail)
- [ ] Service: approveLeaveRequest() - Admin all dept
- [ ] Service: rejectLeaveRequest()
- [ ] Service: cancelLeaveRequest()

**Integration Tests**:
- [ ] POST /leave/create - Success
- [ ] POST /leave/create - Validation errors
- [ ] POST /leave/create - Overlap detection
- [ ] GET /leave/my-requests - Pagination
- [ ] GET /leave/pending/list - Manager sees only own dept
- [ ] GET /leave/pending/list - Admin sees all
- [ ] PATCH /leave/approve/:id - Manager success
- [ ] PATCH /leave/approve/:id - Manager diff dept (403)
- [ ] PATCH /leave/approve/:id - Self approval (403)
- [ ] PATCH /leave/reject/:id - Success
- [ ] PATCH /leave/cancel/:id - Success

---

### 9.2. Frontend Testing

**Manual Tests**:
- [ ] Tạo đơn nghỉ phép - Form validation
- [ ] Tạo đơn nghỉ phép - Submit success
- [ ] Xem danh sách đơn của tôi - Pagination
- [ ] Xem danh sách đơn của tôi - Filter
- [ ] Hủy đơn PENDING
- [ ] Manager xem đơn chờ duyệt (chỉ cùng dept)
- [ ] Admin xem đơn chờ duyệt (all dept)
- [ ] Duyệt đơn - Success
- [ ] Từ chối đơn - Success
- [ ] Access control - Hide buttons cho non-manager

---

## 10. DEPLOYMENT CHECKLIST

- [ ] Tạo migration script cho collection `leave_requests`
- [ ] Seed dữ liệu test (optional)
- [ ] Tạo permissions trong DB:
  - `leave:request:create`
  - `leave:request:view_own`
  - `leave:request:cancel`
  - `leave:request:view_pending`
  - `leave:request:approve`
  - `leave:request:reject`
- [ ] Gán permissions cho roles:
  - USER: create, view_own, cancel
  - MANAGER: create, view_own, cancel, view_pending, approve, reject
  - ADMIN: all permissions
- [ ] Update menu trong DB - Add "Nghỉ phép" menu item
- [ ] Update environment variables
- [ ] Run backend tests
- [ ] Build frontend
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production

---

## 11. KẾT LUẬN

Tài liệu này cung cấp thiết kế chi tiết cho tính năng **Nộp Đơn Xin Nghỉ Phép**, bao gồm:

✅ **Database Schema** - Collection leave_requests với đầy đủ fields
✅ **Backend API** - 8 endpoints với validation đầy đủ
✅ **Service Logic** - Business rules và authorization
✅ **Frontend UI** - 3 pages chính + 4 components
✅ **Access Control** - Phân quyền rõ ràng cho Employee/Manager/Admin
✅ **Workflows** - Quy trình nghiệp vụ chi tiết

Thiết kế này tuân thủ 100% các patterns hiện có trong codebase:
- Backend: Routes → Middleware → Controller → Service → Repository
- Frontend: BasicTable + ProForm + React Query
- Authentication: JWT + Role-based authorization
- Validation: express-validator

---

**Người thiết kế**: Claude AI
**Ngày**: 2025-11-14
**Version**: 1.0
