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
import { USER_PATH_ROUTES } from './constants/path-routes/user/user.path-routes'
import adminActionsUserRouters from './routes/admin/admin-actions-userr.routes'

config()

const PORT = configMongodb.app.port

const app = express()

instanceMongodb.connect()
checkOverload()

app.use(compression())
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(USER_PATH_ROUTES.ROOT, userRouters)
app.use(USER_PATH_ROUTES.ROOT, adminActionsUserRouters)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT} in ${configMongodb.name} mode`)
})

export default app
