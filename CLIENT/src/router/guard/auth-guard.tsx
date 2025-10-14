import { fetchAsyncRoutes } from '#src/api/user'
import { useCurrentRoute } from '#src/hooks'
import { hideLoading, setupLoading } from '#src/plugins'
import { exception403Path, exception404Path, exception500Path, loginPath } from '#src/router/extra-info'
import { accessRoutes, whiteRouteNames } from '#src/router/routes'
import { isSendRoutingRequest } from '#src/router/routes/config'
import { generateRoutesByFrontend, generateRoutesFromBackend } from '#src/router/utils'
import { useAccessStore, useAuthStore, usePreferencesStore, useUserStore } from '#src/store'

import { useEffect } from 'react'
import { matchRoutes, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router'

import { removeDuplicateRoutes } from './utils'

/**
 * Routes whitelist:
 * 1. Do not require permission verification.
 * 2. Do not trigger API requests (e.g., user info request).
 *
 * Example: "privacy-policy", "terms-of-service", etc.
 */

const noLoginWhiteList = Array.from(whiteRouteNames).filter((item) => item !== loginPath)

interface AuthGuardProps {
  children?: React.ReactNode
}

/**
 * AuthGuard component — handles permission verification.
 * ⚠️ The order of operations inside is important; do not rearrange.
 */

export function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentRoute = useCurrentRoute()
  const { pathname, search } = useLocation()

  const isLogin = useAuthStore((state) => Boolean(state.access_token))
  const isAuthorized = useUserStore((state) => Boolean(state._id))
  const getUserInfo = useUserStore((state) => state.getUserInfo)
  const userRoles = useUserStore((state) => state.roles)
  const { setAccessStore, isAccessChecked, routeList } = useAccessStore()
  const { enableBackendAccess, enableFrontendAceess } = usePreferencesStore((state) => state)

  const isPathInNoLoginWhiteList = noLoginWhiteList.includes(pathname)

  /**
   * Fetch user info and route configuration asynchronously
   */
  useEffect(() => {
    async function fetchUserInfoAndRoutes() {
      // Show loading animation (avoid flicker on login redirect)
      setupLoading()

      // Initialize an empty array to store promises
      const promises = []

      // Fetch user information
      promises.push(getUserInfo())

      // If backend routes are enabled and fetched via a separate API, send request
      if (enableBackendAccess && isSendRoutingRequest) {
        promises.push(fetchAsyncRoutes())
      }

      const results = await Promise.allSettled(promises)
      const [userInfoResult, routeResult] = results
      const routes: any[] = []
      const latestRoles: any[] = []

      // Extract user roles from the user API response
      if (userInfoResult.status === 'fulfilled' && 'roles' in userInfoResult.value) {
        latestRoles.push(...(userInfoResult.value?.roles ?? []))
      }

      // Backend routing enabled, and routes obtained from user API
      if (
        enableBackendAccess &&
        !isSendRoutingRequest &&
        userInfoResult.status === 'fulfilled' &&
        'menus' in userInfoResult.value
      ) {
        routes.push(...(await generateRoutesFromBackend(userInfoResult.value?.menus ?? [])))
      }

      // Backend routing enabled, and routes obtained from separate API
      if (
        enableBackendAccess &&
        isSendRoutingRequest &&
        routeResult.status === 'fulfilled' &&
        'result' in routeResult.value
      ) {
        routes.push(...(await generateRoutesFromBackend(routeResult.value?.result ?? [])))
      }

      // Frontend routing enabled
      if (enableFrontendAceess) {
        routes.push(...generateRoutesByFrontend(accessRoutes, latestRoles))
      }

      const uniqueRoutes = removeDuplicateRoutes(routes)
      setAccessStore(uniqueRoutes)

      // Handle request failures → redirect to 500 page (except 401)
      const hasError = results.some((result) => result.status === 'rejected')
      if (hasError) {
        const unAuthorized = results.some((result: any) => result.reason.response.status === 401)
        if (!unAuthorized) {
          return navigate(exception500Path)
        }
      }

      /**
       * Dynamic routing behavior explanation:
       * 1. User navigates to a dynamic route (e.g., /system/user).
       * 2. Before dynamic routes are added, the address bar still shows /system/user,
       *    but it matches the fallback route (path="*").
       * 3. After dynamic routes are added, use `replace` to trigger a new match and re-render.
       *
       * Reference: https://router.vuejs.org/guide/advanced/dynamic-routing#Adding-routes
       */
      navigate(`${pathname}${search}`, {
        replace: true,
        // Prevent showing 404 during the route replacement (especially on slow networks)
        flushSync: true
      })
    }

    /**
     * Execute fetching logic only when:
     * 1. Current route is not in the whitelist
     * 2. User is logged in
     * 3. User or route info has not been fetched yet
     */
    if (!whiteRouteNames.includes(pathname) && isLogin && !isAuthorized) {
      fetchUserInfoAndRoutes()
    }
  }, [pathname, isLogin, isAuthorized])

  // Whitelist routes
  if (isPathInNoLoginWhiteList) {
    hideLoading()
    return children
  }

  // Handling when user is NOT logged in
  if (!isLogin) {
    hideLoading()

    // If not logged in and not on login page → redirect to login
    if (pathname !== loginPath) {
      const redirectPath = pathname.length > 1 ? `${loginPath}?redirect=${pathname}${search}` : loginPath
      return <Navigate to={redirectPath} replace />
    }
    // If already on login page → allow access
    else {
      return children
    }
  }

  // Handling when user IS logged in

  // Logged in → accessing login page → redirect to home or redirect param
  if (pathname === loginPath) {
    const redirectPath = searchParams.get('redirect')
    if (redirectPath?.length && redirectPath !== pathname) {
      return <Navigate to={redirectPath} replace />
    }
    return <Navigate to={import.meta.env.VITE_BASE_HOME_PATH} replace />
  }

  // Waiting for user info
  if (!isAuthorized) {
    return null
  }

  // Waiting for route info
  if (!isAccessChecked) {
    return null
  }

  // Hide loading animation
  hideLoading()

  // Root path → redirect to home page
  if (pathname === '/') {
    return <Navigate to={import.meta.env.VITE_BASE_HOME_PATH} replace />
  }

  // Route permission verification
  const routeRoles = currentRoute?.handle?.roles
  const ignoreAccess = currentRoute?.handle?.ignoreAccess

  // Ignore access control if explicitly set
  if (ignoreAccess === true) {
    return children
  }

  const matches = matchRoutes(routeList, pathname) ?? []

  const hasChildren = matches[matches.length - 1]?.route?.children?.filter((item) => !item.index)?.length

  // If current route has sub-routes → redirect to 404
  if (hasChildren && hasChildren > 0) {
    return <Navigate to={exception404Path} replace />
  }

  // Role-based access check
  const hasRoutePermission = userRoles.some((role) => routeRoles?.includes(role))

  /**
   * Permission logic:
   * 1. If route has no `roles`, treat as open-access (same as ignoreAccess=true)
   * 2. If access denied → cancel navigation and redirect to 403
   */
  if (routeRoles && routeRoles.length && !hasRoutePermission) {
    return <Navigate to={exception403Path} replace />
  }

  return children
}

/**
 * Steps to verify routing and redirection logic:
 * 1. Not logged in → open login route
 * 2. Not logged in → open a non-login route
 * 3. Logged in → logout, then login again
 * 4. Choose any non-home page → clear localStorage → refresh → login
 * 5. Logged in → open login route
 * 6. Logged in → open a non-login route
 * 7. Logged in → visit http://localhost:3333 → redirects to /home, user API called once
 * 8. Logged in → visit http://localhost:3333/ → redirects to /home, user API called once
 * 9. Logged in → visit http://localhost:3333/home → redirects to /home, user API called once
 */
