import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },


]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   const esVistaProtegida = to.matched.some((item) => item.meta.vistaProtegida);
//   if (esVistaProtegida && store.state.Id === null) {
//     next('/');
//   } else {
//     next();
//   }
// });

export default router;