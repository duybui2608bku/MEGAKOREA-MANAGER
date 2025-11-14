import express from 'express'
import compression from 'compression'
import helmet from 'helmet'
import morgan from 'morgan'
import instanceMongodb from './db/init.mongodb'
import './models'
import { checkOverload } from './helpers/check.connect'
import { config } from 'dotenv'
import configMongodb from './config/congif.mongodb'
import { defaultErrorHandler } from './middlewares/error/error-middleware'
import userRouters from './routes/user/user.routes'
import adminActionsUserRouters from './routes/admin/admin-actions-user.routes'
import departmentRouters from './routes/department/department.routes'
import roleRouters from './routes/role/role.routes'
import permissionRouters from './routes/permission/permission.routes'
import menuRouters from './routes/menu/menu.routes'
import cors from 'cors'
import { ADMIN_PATH_ROUTES } from './constants/path-routes/admin/admin.path-routes'
import { DEPARTMENT_PATH_ROUTES } from './constants/path-routes/derpartment/derpartment.path-routes'
import { PERMISSION_PATH_ROUTES } from './constants/path-routes/permission/permission.path-routes'
import { ROLE_PATH_ROUTES } from './constants/path-routes/roles/roles.path-routes'
import { USER_PATH_ROUTES } from './constants/path-routes/user/user.path-routes'
import { MENU_PATH_ROUTES } from './constants/path-routes/menu/menu.path-route'
import mediaRouters from './routes/media'
import { MEDIA_PATH_ROUTES } from './constants/path-routes/media'
import { WORKSPACE_PATH } from './routes/workspace/path'
import hrRoutes from './routes/workspace/hr'
import facebookadsRoutes from './routes/workspace/facebookads'
import { WORKSPACE_HR_PATH_ROUTES } from './routes/workspace/hr/path'
import { FACEBOOKADS_PATH_ROUTES } from './routes/workspace/facebookads/path'
import leaveRequestRoutes from './routes/request/leave'
import { LEAVE_REQUEST_PATH_ROUTES } from './constants/path-routes/leave/leave.path-routes'

config()

const PORT = configMongodb.app.port

const app = express()

instanceMongodb.connect()
checkOverload()

// setTimeout(async () => {
//   try {
//     await initializeMenus()
//   } catch (error) {
//     console.error('Failed to initialize permissions, roles, and menus:', error)
//   }
// }, 2000)

app.use(cors())
app.use(compression())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(USER_PATH_ROUTES.ROOT, userRouters)
app.use(ADMIN_PATH_ROUTES.ROOT, adminActionsUserRouters)
app.use(PERMISSION_PATH_ROUTES.ROOT, permissionRouters)
app.use(DEPARTMENT_PATH_ROUTES.ROOT, departmentRouters)
app.use(ROLE_PATH_ROUTES.ROOT, roleRouters)
app.use(MENU_PATH_ROUTES.ROOT, menuRouters)
app.use(MEDIA_PATH_ROUTES.ROOT, mediaRouters)
app.use(`${WORKSPACE_PATH.ROOT}${WORKSPACE_HR_PATH_ROUTES.ROOT}`, hrRoutes)
app.use(`${WORKSPACE_PATH.ROOT}${FACEBOOKADS_PATH_ROUTES.ROOT}`, facebookadsRoutes)
app.use(LEAVE_REQUEST_PATH_ROUTES.ROOT, leaveRequestRoutes)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} in ${configMongodb.name} mode`)
})

export default app
