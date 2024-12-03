import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PurchaseView from '../views/PurchaseView.vue';
// import SellView from '../views/SellView.vue';
// import HistorialView from '../views/HistorialView.vue';
// import AnalisisActualView from '../views/AnalisisActualView.vue';
// import AnalisisInversionView from '../views/AnalisisInversionView.vue';
const routes = [
  {
    path:'/',
    redirect:'/login',
  },
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
  {
    path: '/purchase',
    name: 'purchase',
    component: PurchaseView,
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