import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import PurchaseView from '../views/PurchaseView.vue';
import SaleView from '../views/SaleView.vue';
import HistorycalView from '../views/HistorycalView.vue';
import AnalitycView from '../views/AnalitycView.vue';
import InvestmentAnalyticView from '../views/InvestmentAnalyticView.vue';
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
  {
    path: '/sale',
    name: 'sale',
    component: SaleView,
  },
  {
    path: '/historycal',
    name: 'historycal',
    component: HistorycalView,
  },
  {
    path: '/analityc',
    name: 'analityc',
    component: AnalitycView,
  },
  {
    path: '/investmentAnalytic',
    name: 'investmentAnalytic',
    component: InvestmentAnalyticView,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;