import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/router';
import {store} from './store';
import {createPinia} from 'pinia';
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura'

const app = createApp(App);

const storePinia = createPinia(store);

app.use(storePinia);
app.use(PrimeVue,{ unstyled: true});
app.use(router);
app.mount('#app');

