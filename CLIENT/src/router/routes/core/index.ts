import type { RouteObject } from 'react-router'

import { addRouteIdByPath } from '#src/router/utils'

import authRoutes from './auth'
import exceptionRoutes from './exception'
import fallbackRoute from './fallback'

export const coreRoutes: any = [
  ...addRouteIdByPath([...authRoutes, ...exceptionRoutes]),
  ...fallbackRoute
] satisfies RouteObject[]
