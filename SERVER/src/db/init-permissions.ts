import PermissionService from '~/services/permission/permission.service'
import { User } from '~/models'

export async function initializePermissionsAndRoles() {
  try {
    console.log('🔄 Initializing permissions and roles...')

    // await PermissionService.initializePermissions()
    console.log('✅ Permissions initialized')

    // await PermissionService.initializeRoles()
    console.log('✅ Roles initialized')

    // await assignDefaultRolesToUsers()
    console.log('✅ Default roles assigned to users')

    console.log('🎉 Permissions and roles initialization completed')
  } catch (error) {
    console.error('❌ Error initializing permissions and roles:', error)
    throw error
  }
}

// async function assignDefaultRolesToUsers() {
//   try {
//     const users = await User.find({ roles: { $size: 0 } })

//     for (const user of users) {
//       // Assign default 'common' role to users without roles
//       const defaultRole = await PermissionService.getRoleByCode('common')
//       if (defaultRole) {
//         user.roles = [defaultRole._id]
//         await user.save()
//         console.log(`✅ Assigned default role "common" to user ${user.email}`)
//       }
//     }
//   } catch (error) {
//     console.error('❌ Error assigning default roles to users:', error)
//     throw error
//   }
// }
