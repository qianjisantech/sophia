import { createApp } from 'vue'
import { createPinia } from 'pinia'
import TDesign from 'tdesign-vue-next'
import router from './router'
import App from './App.vue'

// 引入 TDesign 样式
import 'tdesign-vue-next/es/style/index.css'
// 引入全局样式
import './styles/index.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(TDesign)

app.mount('#app')
