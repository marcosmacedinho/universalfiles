import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import LoginView from '../views/Login.vue';
import PublicView from '../views/PublicView.vue';
import UploadView from '../views/UploadView.vue';
import DashboardView from '../views/Dashboard.vue';

const routes = [
  { path: '/login', component: LoginView },
  { path: '/public', component: PublicView },
  { path: '/upload', component: UploadView, meta: { requiresAuth: true } },
  { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/', redirect: '/public' },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const isAuthenticated = !!auth.currentUser;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
