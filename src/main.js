import { createApp } from 'vue';
import router from "./router";
import store from './store';
import eventBus from "./utils/event.bus";
import Notifications from '@kyvg/vue3-notification'
import App from './App.vue';
import i18n from './i18n';
import { CircleStencil } from 'vue-advanced-cropper';
const app = createApp(App).use(i18n);
app.component('CircleStencil',CircleStencil);
app.config.globalProperties.eventBus = eventBus;
app.config.warnHandler = () => null
app.use(router);
app.use(store);
app.use(Notifications)
app.mount('#app');
