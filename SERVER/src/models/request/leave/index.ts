import mongoose from 'mongoose'
import { COLLECTION_NAME } from '~/constants/collecttions/name.collecttions'
import { DurationType, LeaveRequestStatus, LeaveType } from '~/constants/enum/leave/leave.enum'

const leaveRequestSchema = new mongoose.Schema(
  {
    // M„ °n tÒ Ÿng (LR-YYYYMMDD-XXXX)
    request_code: {
      type: String,
      unique: true,
      index: true,
      required: true
    },

    // Ng∞›i nŸp °n
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.USER,
      required: true,
      index: true
    },

    // Lo°i ngh…
    leave_type: {
      type: String,
      enum: Object.values(LeaveType),
      required: true,
      index: true
    },

    // Lo°i th›i gian ngh…
    duration_type: {
      type: String,
      enum: Object.values(DurationType),
      required: true,
      default: DurationType.FULL_DAY
    },

    // Ng‡y bØt ßu ngh…
    start_date: {
      type: Date,
      required: true,
      index: true
    },

    // Ng‡y køt th˙c ngh…
    end_date: {
      type: Date,
      required: true
    },

    // T’ng s— ng‡y ngh… (tÌnh tÒ Ÿng)
    total_days: {
      type: Number,
      required: true,
      default: 1
    },

    // L˝ do ngh…
    reason: {
      type: String,
      required: true,
      minlength: 10
    },

    // Tr°ng th·i °n
    status: {
      type: Number,
      enum: Object.values(LeaveRequestStatus),
      default: LeaveRequestStatus.PENDING,
      index: true
    },

    // Ng∞›i duy«t
    approver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTION_NAME.USER,
      default: null
    },

    // Th›i gian duy«t
    approved_at: {
      type: Date,
      default: null
    },

    // Th›i gian tÎ ch—i
    rejected_at: {
      type: Date,
      default: null
    },

    // Th›i gian hÁy
    cancelled_at: {
      type: Date,
      default: null
    },

    // Ghi ch˙ khi duy«t
    approval_note: {
      type: String,
      default: null
    },

    // L˝ do tÎ ch—i
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
    collection: COLLECTION_NAME.LEAVE_REQUEST,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
)

// Index compound √ t—i ∞u query
leaveRequestSchema.index({ user: 1, status: 1 })
leaveRequestSchema.index({ status: 1, created_at: -1 })
leaveRequestSchema.index({ start_date: 1, end_date: 1 })

const LeaveRequest = mongoose.model(COLLECTION_NAME.LEAVE_REQUEST as string, leaveRequestSchema)
export default LeaveRequest
