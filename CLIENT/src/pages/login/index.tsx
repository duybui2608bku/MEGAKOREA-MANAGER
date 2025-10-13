import type { FormComponentMapType } from './form-mode-context'
import Banner from '#src/assets/svg/banner.svg?react'
import logo from '#src/assets/svg/logo.svg?url'
import { LayoutFooter } from '#src/layout'
import { ThemeButton } from '#src/layout/layout-header/components/theme-button'

import { Col, Grid, Row, theme } from 'antd'
import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { FORM_COMPONENT_MAP, FormModeContext } from './form-mode-context'

export default function Login() {
  const { token } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const [formMode, setFormMode] = useState<FormComponentMapType>('login')

  const providedValue = useMemo(() => ({ formMode, setFormMode }), [formMode, setFormMode])
  return (
    <div
      style={{
        backgroundColor: token.colorBgContainer
      }}
    >
      <header className='z-10 absolute flex items-center right-3 top-3 left-3'>
        <div className='text-colorText flex flex-1 items-center'>
          <img alt='App Logo' src={logo} className='mr-2 w-11' />
          <h1 className='m-0 text-xl font-medium'>{import.meta.env.VITE_GLOB_APP_TITLE}</h1>
        </div>
        <div className='flex items-center'>
          <ThemeButton />
        </div>
      </header>
      <div className='flex items-center overflow-hidden h-full'>
        <Row className={clsx('h-screen w-full')}>
          <Col
            xs={0}
            sm={0}
            lg={15}
            style={{
              backgroundImage: `radial-gradient(${token.colorBgContainer}, ${token.colorPrimaryBg})`
            }}
            className={clsx({ hidden: false })}
          >
            <div className='flex flex-col items-center justify-center h-full gap-3'>
              <Banner className='h-64 motion-safe:animate-bounceInDownOutUp' />
              <div className='text-xl text-colorTextSecondary mt-6 font-sans lg:text-2xl'>Đăng nhập hệ thống</div>
              <div className='text-colorTextTertiary mt-2'>Vui lòng đăng nhập để tiếp tục</div>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            lg={9}
            className='relative flex flex-col justify-center px-6 py-10 xl:px-8'
            style={
              !screens.xl && !screens.xxl && !screens.lg
                ? {
                    backgroundImage: `radial-gradient(${token.colorBgContainer}, ${token.colorPrimaryBg})`
                  }
                : {}
            }
          >
            <LayoutFooter className='w-full absolute bottom-3 left-1/2 -translate-x-1/2' />
            <div className='w-full sm:mx-auto md:max-w-md'>
              <FormModeContext.Provider value={providedValue}>
                <AnimatePresence mode='wait' initial={false}>
                  <motion.div
                    key={formMode}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {FORM_COMPONENT_MAP[formMode]}
                  </motion.div>
                </AnimatePresence>
              </FormModeContext.Provider>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  )
}
