import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useStore } from 'vuex';

export default route(function () {
  const createHistory = process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    const store = useStore();

    try {
      await store.dispatch('auth/checkAuth');
      const isLoggedIn = store.getters['auth/getIsLoggedIn'];


      if (requiresAuth && !isLoggedIn) {
        next('/');
      } else {
        next();
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      next('/');
    }
  });

  return Router;
});
