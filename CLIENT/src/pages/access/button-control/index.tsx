import type { PasswordLoginFormType } from '#src/pages/login/components/password-login'
import { AccessControl, BasicContent } from '#src/components'
import { accessControlCodes, AccessControlRoles, useAccess } from '#src/hooks'
import { useAuthStore, useUserStore } from '#src/store'

import { Alert, Button, Card, Typography } from 'antd'

import { Fragment } from 'react/jsx-runtime'
import { useNavigate } from 'react-router'

const accounts: Record<string, PasswordLoginFormType> = {
  [AccessControlRoles.admin]: {
    password: '123456789admin',
    email: AccessControlRoles.admin
  },
  [AccessControlRoles.user]: {
    password: '123456789admin',
    email: AccessControlRoles.user
  }
}

export default function ButtonControl() {
  const navigate = useNavigate()
  const { hasAccessByCodes, hasAccessByRoles } = useAccess()
  const { roles: userRoles } = useUserStore()
  const resetAllStores = useAuthStore((state) => state.reset)
  const authLogin = useAuthStore((state) => state.login)

  function roleButtonType(role: string) {
    return userRoles.includes(role) ? 'primary' : 'default'
  }

  function changeAccount(role: string) {
    if (userRoles.includes(role)) {
      return
    }

    const account = accounts[role]
    resetAllStores()
    if (account) {
      authLogin(account).then(() => {
        navigate(0)
      })
    }
  }

  return (
    <BasicContent className='flex flex-col gap-4'>
      <Alert message={'Quyền hiện tại'} description={'Quyền hiện tại'}></Alert>
      <Card
        title={
          <Fragment>
            {'Quyền hiện tại'}
            &nbsp;&nbsp;
            <Typography.Text mark code>
              {userRoles}
            </Typography.Text>
          </Fragment>
        }
      >
        <div className='flex gap-4'>
          <Button
            type={roleButtonType(AccessControlRoles.admin)}
            onClick={() => changeAccount(AccessControlRoles.admin)}
          >
            {'Chuyển quyền admin'}
          </Button>
          <Button type={roleButtonType(AccessControlRoles.user)} onClick={() => changeAccount(AccessControlRoles.user)}>
            {'Chuyển quyền user'}
          </Button>
        </div>
      </Card>
      <Card title={'Quyền hiện tại'}>
        <div className='flex items-center gap-4'>
          <AccessControl codes={accessControlCodes.get}>
            <Typography.Text code>{accessControlCodes.get}</Typography.Text>
          </AccessControl>

          <AccessControl codes={accessControlCodes.update}>
            <Typography.Text code>{accessControlCodes.update}</Typography.Text>
          </AccessControl>

          <AccessControl codes={accessControlCodes.delete}>
            <Typography.Text code>{accessControlCodes.delete}</Typography.Text>
          </AccessControl>

          <AccessControl codes={accessControlCodes.add}>
            <Typography.Text code>{accessControlCodes.add}</Typography.Text>
          </AccessControl>
        </div>
      </Card>
      <Card title={'Quyền hiện tại'}>
        <div className='flex items-center gap-4'>
          <AccessControl type='role' codes={[AccessControlRoles.admin, AccessControlRoles.user]}>
            <Typography.Text code>
              {'Quyền admin'}
              &nbsp;&&nbsp;
              {'Quyền user'}
            </Typography.Text>
          </AccessControl>

          <AccessControl type='role' codes={AccessControlRoles.admin}>
            <Typography.Text code>{'Quyền admin'}</Typography.Text>
          </AccessControl>

          <AccessControl type='role' codes={AccessControlRoles.user}>
            <Typography.Text code>{'Quyền common'}</Typography.Text>
          </AccessControl>
        </div>
      </Card>
      <Card title={'Quyền hiện tại'}>
        <div className='flex items-center gap-4'>
          {hasAccessByCodes(accessControlCodes.get) && <Typography.Text code>{accessControlCodes.get}</Typography.Text>}

          {hasAccessByCodes(accessControlCodes.update) && (
            <Typography.Text code>{accessControlCodes.update}</Typography.Text>
          )}

          {hasAccessByCodes(accessControlCodes.delete) && (
            <Typography.Text code>{accessControlCodes.delete}</Typography.Text>
          )}

          {hasAccessByCodes([accessControlCodes.add]) && (
            <Typography.Text code>{accessControlCodes.add}</Typography.Text>
          )}
        </div>
      </Card>
      <Card title={'Quyền hiện tại'}>
        <div className='flex items-center gap-4'>
          {hasAccessByRoles([AccessControlRoles.admin, AccessControlRoles.user]) && (
            <Typography.Text code>
              {'Quyền admin'}
              &nbsp;&&nbsp;
              {'Quyền user'}
            </Typography.Text>
          )}
          {hasAccessByRoles([AccessControlRoles.admin]) && <Typography.Text code>{'Quyền admin'}</Typography.Text>}
          {hasAccessByRoles(AccessControlRoles.user) && <Typography.Text code>{'Quyền user'}</Typography.Text>}
        </div>
      </Card>
    </BasicContent>
  )
}
