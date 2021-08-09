import { createApp } from 'vue'
import App from './App.vue'

function render() {
    createApp(App).mount('#app');
}

declare global {
    interface Window {
        __POWERED_BY_QIANKUN__: unknown;
    }
}

if (!window.__POWERED_BY_QIANKUN__) {
    render();
}