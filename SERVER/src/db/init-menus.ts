import { Menu } from '~/models'

const menuData = [
  // Root level menus
  {
    _id: '507f1f77bcf86cd799439011',
    path: '/home',
    component: '/home/index.tsx',
    name: 'home',
    title: 'common.menu.home',
    icon: 'HomeOutlined',
    order: 1,
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439012',
    path: '/access',
    name: 'access',
    title: 'common.menu.access',
    icon: 'SafetyOutlined',
    order: 2,
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439013',
    path: '/about',
    component: '/about/index.tsx',
    name: 'about',
    title: 'common.menu.about',
    icon: 'CopyrightOutlined',
    order: 3,
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439014',
    path: '/system',
    name: 'system',
    title: 'common.menu.system',
    icon: 'SettingOutlined',
    order: 4,
    roles: ['admin'],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439015',
    path: '/outside',
    name: 'outside',
    title: 'common.menu.outside',
    icon: 'OutsidePageIcon',
    order: 5,
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439016',
    path: '/personal-center',
    name: 'personal-center',
    title: 'common.menu.personalCenter',
    icon: 'RiAccountCircleLine',
    order: 6,
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439017',
    path: '/route-nest',
    name: 'route-nest',
    title: 'common.menu.nestMenus',
    icon: 'NodeExpandOutlined',
    order: 7,
    roles: [],
    permissions: [],
    status: 1
  },

  // Access children
  {
    _id: '507f1f77bcf86cd799439021',
    path: '/access/access-mode',
    name: 'access-mode',
    title: 'common.menu.accessMode',
    icon: 'CloudOutlined',
    parentId: '507f1f77bcf86cd799439012',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439022',
    path: '/access/page-control',
    name: 'page-control',
    title: 'common.menu.pageControl',
    icon: 'FileTextOutlined',
    parentId: '507f1f77bcf86cd799439012',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439023',
    path: '/access/button-control',
    name: 'button-control',
    title: 'common.menu.buttonControl',
    icon: 'LockOutlined',
    parentId: '507f1f77bcf86cd799439012',
    roles: [],
    permissions: ['permission:button:get'],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439024',
    path: '/access/admin-visible',
    name: 'admin-visible',
    title: 'common.menu.adminVisible',
    icon: 'EyeOutlined',
    parentId: '507f1f77bcf86cd799439012',
    roles: ['admin'],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439025',
    path: '/access/common-visible',
    name: 'common-visible',
    title: 'common.menu.commonVisible',
    icon: 'EyeOutlined',
    parentId: '507f1f77bcf86cd799439012',
    roles: ['common'],
    permissions: [],
    status: 1
  },

  // System children (Admin only)
  {
    _id: '507f1f77bcf86cd799439031',
    path: '/system/user',
    component: '/system/user/index.tsx',
    name: 'system-user',
    title: 'common.menu.user',
    icon: 'UserOutlined',
    parentId: '507f1f77bcf86cd799439014',
    roles: ['admin'],
    permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete'],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439032',
    path: '/system/role',
    component: '/system/role/index.tsx',
    name: 'system-role',
    title: 'common.menu.role',
    icon: 'TeamOutlined',
    parentId: '507f1f77bcf86cd799439014',
    roles: ['admin'],
    permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete'],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439033',
    path: '/system/menu',
    component: '/system/menu/index.tsx',
    name: 'system-menu',
    title: 'common.menu.menu',
    icon: 'MenuOutlined',
    parentId: '507f1f77bcf86cd799439014',
    roles: ['admin'],
    permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete'],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439034',
    path: '/system/dept',
    component: '/system/dept/index.tsx',
    name: 'system-dept',
    title: 'common.menu.dept',
    icon: 'ApartmentOutlined',
    parentId: '507f1f77bcf86cd799439014',
    roles: ['admin'],
    permissions: ['permission:button:add', 'permission:button:update', 'permission:button:delete'],
    keepAlive: false,
    status: 1
  },

  // Outside children
  {
    _id: '507f1f77bcf86cd799439041',
    path: '/outside/embedded',
    name: 'outside-embedded',
    title: 'common.menu.embedded',
    icon: 'EmbeddedIcon',
    parentId: '507f1f77bcf86cd799439015',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439042',
    path: '/outside/external-link',
    name: 'outside-external',
    title: 'common.menu.externalLink',
    icon: 'ExternalIcon',
    parentId: '507f1f77bcf86cd799439015',
    roles: [],
    permissions: [],
    status: 1
  },

  // Outside embedded children
  {
    _id: '507f1f77bcf86cd799439051',
    path: '/outside/embedded/ant-design',
    name: 'embedded-antd',
    title: 'common.menu.antd',
    icon: 'AntDesignOutlined',
    parentId: '507f1f77bcf86cd799439041',
    iframeLink: 'https://ant.design/',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439052',
    path: '/outside/embedded/project-docs',
    name: 'embedded-docs',
    title: 'common.menu.projectDocs',
    icon: 'ContainerOutlined',
    parentId: '507f1f77bcf86cd799439041',
    iframeLink: 'https://condorheroblog.github.io/react-antd-admin/docs/',
    roles: [],
    permissions: [],
    status: 1
  },

  // Outside external children
  {
    _id: '507f1f77bcf86cd799439061',
    path: '/outside/external-link/react-docs',
    name: 'external-react',
    title: 'common.menu.reactDocs',
    icon: 'RiReactjsLine',
    parentId: '507f1f77bcf86cd799439042',
    externalLink: 'https://react.dev/',
    roles: [],
    permissions: [],
    status: 1
  },

  // Personal center children
  {
    _id: '507f1f77bcf86cd799439071',
    path: '/personal-center/my-profile',
    name: 'my-profile',
    title: 'common.menu.profile',
    icon: 'ProfileCardIcon',
    parentId: '507f1f77bcf86cd799439016',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439072',
    path: '/personal-center/settings',
    name: 'personal-settings',
    title: 'common.menu.settings',
    icon: 'RiUserSettingsLine',
    parentId: '507f1f77bcf86cd799439016',
    roles: [],
    permissions: [],
    status: 1
  },

  // Route nest children
  {
    _id: '507f1f77bcf86cd799439081',
    path: '/route-nest/menu1',
    name: 'nest-menu1',
    title: 'common.menu.menu1',
    icon: 'SisternodeOutlined',
    parentId: '507f1f77bcf86cd799439017',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439082',
    path: '/route-nest/menu2',
    name: 'nest-menu2',
    title: 'common.menu.menu2',
    icon: 'SubnodeOutlined',
    parentId: '507f1f77bcf86cd799439017',
    roles: [],
    permissions: [],
    status: 1
  },

  // Route nest menu1 children
  {
    _id: '507f1f77bcf86cd799439091',
    path: '/route-nest/menu1/menu1-1',
    name: 'nest-menu1-1',
    title: 'common.menu.menu1-1',
    icon: 'SubnodeOutlined',
    parentId: '507f1f77bcf86cd799439081',
    roles: [],
    permissions: [],
    status: 1
  },
  {
    _id: '507f1f77bcf86cd799439092',
    path: '/route-nest/menu1/menu1-2',
    name: 'nest-menu1-2',
    title: 'common.menu.menu1-2',
    icon: 'SubnodeOutlined',
    parentId: '507f1f77bcf86cd799439081',
    roles: [],
    permissions: [],
    status: 1
  }
]

export const initializeMenus = async () => {
  try {
    const existingMenusCount = await Menu.countDocuments()

    if (existingMenusCount === 0) {
      console.log('🌱 Initializing default menus...')

      await Menu.insertMany(menuData)

      console.log('✅ Default menus initialized successfully!')
      console.log(`📊 Created ${menuData.length} menu items`)
    } else {
      console.log('📋 Menus already exist, skipping initialization')
    }
  } catch (error) {
    console.error('❌ Error initializing menus:', error)
    throw error
  }
}
