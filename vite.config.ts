import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 监听所有网络接口，允许通过IP访问
    port: 5173, // 默认端口，可以根据需要修改
    strictPort: false, // 如果端口被占用，自动尝试下一个可用端口
  },
})
