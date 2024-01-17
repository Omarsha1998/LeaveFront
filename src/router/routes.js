const routes = [

  {
    path: '/',
    name: 'Login',
    component: () => import('components/Login.vue'),
  },
  {
    path: '/Leave',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/LeaveDetails.vue') }],
  },
  {
    path: '/LeaveOperation',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/LeaveOperation.vue') }],
  },

  
];



export default routes;