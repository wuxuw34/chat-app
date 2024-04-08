// import '@/mock/index.ts'
import {createApp} from 'vue'
import './style.scss'
import App from '@/App.vue'
import router from "./router";
import {createPinia} from "pinia";
import registerDirective from "@/directives";
import 'element-plus/dist/index.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'


const app = createApp(App)
registerDirective(app)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.mount('#app')
