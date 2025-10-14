from pathlib import Path

content = """# Access Control {#access}

> For an online demo, visit: https://condorheroblog.github.io/react-antd-admin/access/page-control

The project’s permission system is designed based on **RBAC (Role-Based Access Control)**.
If you are not familiar with RBAC, please refer to relevant resources to learn about it.

## Users

The project simulates two users:

- [Administrator](https://github.com/condorheroblog/react-antd-admin/blob/9bfbd987341e14e61757885a7426b0f88481f78c/fake/user.fake.ts#L21) – username and role: **admin**
- [Regular user](https://github.com/condorheroblog/react-antd-admin/blob/9bfbd987341e14e61757885a7426b0f88481f78c/fake/user.fake.ts#L33) – username and role: **common**

## Roles

The project simulates two roles:

- [admin](https://github.com/condorheroblog/react-antd-admin/blob/9bfbd987341e14e61757885a7426b0f88481f78c/fake/user.fake.ts#L21)
- [common](https://github.com/condorheroblog/react-antd-admin/blob/9bfbd987341e14e61757885a7426b0f88481f78c/fake/user.fake.ts#L33)

## How Permissions Are Retrieved

1. **Frontend-based access control:**
   Routes are hardcoded on the frontend with static role definitions. After login, the user’s role is fetched from the API and used to filter and load the accessible routes.

2. **Backend-based access control:**
   Both routes and roles are dynamically fetched from the backend API after login.

---

### Frontend Access Control

**How it works:**
All route permissions are predefined in the frontend. When the app first loads, only general routes are initialized — routes requiring permissions are not yet added.
After login, the user’s role is retrieved, and the system filters through the route list to generate accessible routes for that role. These routes are then dynamically added to the router via `router.patchRoutes`.

- **Advantages:** Simple setup; suitable for small teams (fewer than 10 users) with fixed roles.
- **Disadvantages:** When backend roles change, the frontend must also be updated — not scalable for large projects.

#### Enable Frontend Access Control

1. **Ensure the mode is set to frontend access control**

Open `src/store/preferences/index.ts` and set the following in `DEFAULT_PREFERENCES`:

```ts
export const DEFAULT_PREFERENCES = {
  enableBackendAccess: false,
  enableFrontendAceess: true
}
```
