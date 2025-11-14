import { Request, Response } from 'express'
import leaveRequestService from '~/services/request/leave'
import { ResponseSuccess } from '~/middlewares/handler/handler.middlewares'
import { LEAVE_REQUEST_MESSAGES } from '~/constants/messages/leave/leave.messages'
import {
  CreateLeaveRequestRequestBody,
  ApproveLeaveRequestRequestBody,
  RejectLeaveRequestRequestBody,
  GetLeaveRequestsFilters
} from '~/interfaces/leave/leave.interface'

/**
 * T¡o ¡n nghÉ phép mÛi
 * POST /leave/create
 */
export const createLeaveRequestController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization?.user_id as string
  const data: CreateLeaveRequestRequestBody = req.body

  const result = await leaveRequestService.createLeaveRequest(userId, data)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.CREATE_SUCCESS,
    res,
    result
  })
}

/**
 * L¥y danh sách ¡n nghÉ phép cça tôi
 * GET /leave/my-requests
 */
export const getMyLeaveRequestsController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization?.user_id as string
  const filters: GetLeaveRequestsFilters = {
    status: req.query.status ? Number(req.query.status) : undefined,
    leave_type: req.query.leave_type as any,
    start_date: req.query.start_date as string,
    end_date: req.query.end_date as string,
    current: req.query.current ? Number(req.query.current) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10
  }

  const result = await leaveRequestService.getMyLeaveRequests(userId, filters)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.GET_LIST_SUCCESS,
    res,
    result
  })
}

/**
 * L¥y thÑng kê ¡n nghÉ phép cça tôi
 * GET /leave/my-stats
 */
export const getLeaveRequestStatsController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization?.user_id as string

  const result = await leaveRequestService.getMyLeaveRequestStats(userId)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.GET_STATS_SUCCESS,
    res,
    result
  })
}

/**
 * L¥y danh sách ¡n chÝ duyÇt (Manager/Admin)
 * GET /leave/pending/list
 */
export const getPendingLeaveRequestsController = async (req: Request, res: Response) => {
  const approverId = req.decoded_authorization?.user_id as string
  const filters: GetLeaveRequestsFilters = {
    leave_type: req.query.leave_type as any,
    department: req.query.department as string,
    current: req.query.current ? Number(req.query.current) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20
  }

  const result = await leaveRequestService.getPendingLeaveRequests(approverId, filters)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.GET_LIST_SUCCESS,
    res,
    result
  })
}

/**
 * L¥y chi ti¿t ¡n nghÉ phép
 * GET /leave/:id
 */
export const getLeaveRequestByIdController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization?.user_id as string
  const requestId = req.params.id

  const result = await leaveRequestService.getLeaveRequestById(requestId, userId)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.GET_SUCCESS,
    res,
    result
  })
}

/**
 * DuyÇt ¡n nghÉ phép
 * PATCH /leave/approve/:id
 */
export const approveLeaveRequestController = async (req: Request, res: Response) => {
  const approverId = req.decoded_authorization?.user_id as string
  const requestId = req.params.id
  const data: ApproveLeaveRequestRequestBody = req.body

  const result = await leaveRequestService.approveLeaveRequest(requestId, approverId, data)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.APPROVE_SUCCESS,
    res,
    result
  })
}

/**
 * Të chÑi ¡n nghÉ phép
 * PATCH /leave/reject/:id
 */
export const rejectLeaveRequestController = async (req: Request, res: Response) => {
  const approverId = req.decoded_authorization?.user_id as string
  const requestId = req.params.id
  const data: RejectLeaveRequestRequestBody = req.body

  const result = await leaveRequestService.rejectLeaveRequest(requestId, approverId, data)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.REJECT_SUCCESS,
    res,
    result
  })
}

/**
 * Hçy ¡n nghÉ phép
 * PATCH /leave/cancel/:id
 */
export const cancelLeaveRequestController = async (req: Request, res: Response) => {
  const userId = req.decoded_authorization?.user_id as string
  const requestId = req.params.id

  const result = await leaveRequestService.cancelLeaveRequest(requestId, userId)

  ResponseSuccess({
    message: LEAVE_REQUEST_MESSAGES.CANCEL_SUCCESS,
    res,
    result
  })
}
