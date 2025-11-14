import { Router } from 'express'
import {
  createLeaveRequestController,
  getMyLeaveRequestsController,
  getLeaveRequestStatsController,
  getPendingLeaveRequestsController,
  getLeaveRequestByIdController,
  approveLeaveRequestController,
  rejectLeaveRequestController,
  cancelLeaveRequestController
} from '~/controllers/request/leave'
import { wrapRequestHandler } from '~/middlewares/handler/handler.middlewares'
import { accessTokenValidator } from '~/middlewares/user/user.middleware'
import {
  createLeaveRequestValidator,
  approveLeaveRequestValidator,
  rejectLeaveRequestValidator,
  cancelLeaveRequestValidator,
  getLeaveRequestByIdValidator
} from '~/middlewares/request/leave'
import { requireRoles } from '~/middlewares/auth/authorization.middleware'
import { PermissionRoles } from '~/constants/enum/permision/permission.enum'
import { LEAVE_REQUEST_PATH_ROUTES } from '~/constants/path-routes/leave/leave.path-routes'

const leaveRequestRoutes = Router()

// Tất cả routes đều cần authentication
leaveRequestRoutes.use(accessTokenValidator)

// Employee routes - Ai cũng có thể tạo và xem đơn của mình
leaveRequestRoutes.post(
  LEAVE_REQUEST_PATH_ROUTES.CREATE,
  createLeaveRequestValidator,
  wrapRequestHandler(createLeaveRequestController)
)

leaveRequestRoutes.get(LEAVE_REQUEST_PATH_ROUTES.GET_MY_REQUESTS, wrapRequestHandler(getMyLeaveRequestsController))

leaveRequestRoutes.get(LEAVE_REQUEST_PATH_ROUTES.GET_MY_STATS, wrapRequestHandler(getLeaveRequestStatsController))

leaveRequestRoutes.get(
  LEAVE_REQUEST_PATH_ROUTES.GET_BY_ID,
  getLeaveRequestByIdValidator,
  wrapRequestHandler(getLeaveRequestByIdController)
)

leaveRequestRoutes.patch(
  LEAVE_REQUEST_PATH_ROUTES.CANCEL,
  cancelLeaveRequestValidator,
  wrapRequestHandler(cancelLeaveRequestController)
)

// Manager/Admin routes - Xem và duyệt đơn
leaveRequestRoutes.get(
  LEAVE_REQUEST_PATH_ROUTES.GET_PENDING_LIST,
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  wrapRequestHandler(getPendingLeaveRequestsController)
)

leaveRequestRoutes.patch(
  LEAVE_REQUEST_PATH_ROUTES.APPROVE,
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  approveLeaveRequestValidator,
  wrapRequestHandler(approveLeaveRequestController)
)

leaveRequestRoutes.patch(
  LEAVE_REQUEST_PATH_ROUTES.REJECT,
  requireRoles([PermissionRoles.MANAGER, PermissionRoles.ADMIN]),
  rejectLeaveRequestValidator,
  wrapRequestHandler(rejectLeaveRequestController)
)

export default leaveRequestRoutes
