<template>
  <div style="padding: 40px; background: white; min-height: 100vh; font-family: monospace;">
    <h1 style="color: green; font-size: 32px; margin-bottom: 20px;">✅ Vue Debug Page</h1>

    <div style="background: #e6f7ff; padding: 20px; border: 2px solid #1890ff; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="margin-top: 0;">Diagnostic Information:</h2>
      <ul style="line-height: 2;">
        <li><strong>Vue is loaded:</strong> ✅ YES</li>
        <li><strong>Component is rendering:</strong> ✅ YES</li>
        <li><strong>Current time:</strong> {{ currentTime }}</li>
        <li><strong>Counter:</strong> {{ counter }} <button @click="counter++" style="margin-left: 10px; padding: 5px 15px;">Increment</button></li>
        <li><strong>Router available:</strong> {{ routerAvailable ? '✅ YES' : '❌ NO' }}</li>
        <li><strong>Current route:</strong> {{ currentRoute }}</li>
      </ul>
    </div>

    <div style="background: #f6ffed; padding: 20px; border: 2px solid #52c41a; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="margin-top: 0;">JavaScript is working!</h3>
      <p>This means:</p>
      <ul>
        <li>Browser can execute JavaScript ✅</li>
        <li>Vue is properly mounted ✅</li>
        <li>Components can render ✅</li>
        <li>Reactivity is working ✅</li>
      </ul>
    </div>

    <div style="background: #fff7e6; padding: 20px; border: 2px solid #fa8c16; border-radius: 8px;">
      <h3 style="margin-top: 0;">Navigation Links:</h3>
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <a href="/" style="color: #0052D9; font-size: 16px; text-decoration: none;">→ Go to Home (/)</a>
        <a href="/test" style="color: #0052D9; font-size: 16px; text-decoration: none;">→ Go to Test (/test)</a>
        <a href="/documents" style="color: #0052D9; font-size: 16px; text-decoration: none;">→ Go to Documents (/documents)</a>
        <a href="/document/1" style="color: #0052D9; font-size: 16px; text-decoration: none;">→ Go to Document Editor (/document/1)</a>
      </div>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: #f5f5f5; border-radius: 8px;">
      <h3>Console Test</h3>
      <button
        @click="logToConsole"
        style="padding: 10px 20px; background: #0052D9; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;"
      >
        Click to Log to Console
      </button>
      <p style="margin-top: 10px; color: #666;">Press F12 and check the Console tab after clicking the button above.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const counter = ref(0)
const currentTime = ref(new Date().toLocaleString())

let router, route
let routerAvailable = ref(false)
let currentRoute = ref('N/A')

try {
  router = useRouter()
  route = useRoute()
  routerAvailable.value = true
  currentRoute.value = route.path
} catch (e) {
  console.error('Router not available:', e)
  routerAvailable.value = false
}

onMounted(() => {
  console.log('✅ Debug.vue mounted successfully!')
  console.log('Current time:', new Date().toLocaleString())

  // Update time every second
  setInterval(() => {
    currentTime.value = new Date().toLocaleString()
  }, 1000)
})

const logToConsole = () => {
  console.log('🎉 Button clicked! Console is working!')
  console.log('Counter value:', counter.value)
  console.log('Router available:', routerAvailable.value)
  alert('Check the browser console (F12) - you should see log messages!')
}
</script>
