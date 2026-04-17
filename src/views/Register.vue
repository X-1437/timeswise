<template>
  <div class="flex flex-col min-h-screen font-sans">
    <header class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <div class="text-primary flex items-center cursor-pointer" @click="$router.push('/')">
          <span class="material-symbols-outlined text-3xl">query_stats</span>
        </div>
        <h2 class="text-xl font-bold tracking-tight text-primary cursor-pointer" @click="$router.push('/')">TimeWise</h2>
      </div>
    </header>
    
    <main class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">注册账号</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-2">创建您的 TimeWise 账号</p>
          </div>
          
          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户名</label>
              <input 
                v-model="form.username" 
                type="text" 
                required
                minlength="4"
                maxlength="20"
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="请输入用户名（4-20位）"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">邮箱</label>
              <input 
                v-model="form.email" 
                type="email" 
                required
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="请输入邮箱"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">密码</label>
              <input 
                v-model="form.password" 
                type="password" 
                required
                minlength="8"
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="请输入密码（8位以上）"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">确认密码</label>
              <input 
                v-model="form.confirmPassword" 
                type="password" 
                required
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="请再次输入密码"
              />
            </div>
            
            <div v-if="errorMessage" class="text-red-500 text-sm text-center">
              {{ errorMessage }}
            </div>
            
            <div v-if="successMessage" class="text-green-500 text-sm text-center">
              {{ successMessage }}
            </div>
            
            <button 
              type="submit"
              :disabled="loading"
              class="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-slate-500 dark:text-slate-400">
              已有账号？
              <span class="text-primary font-medium cursor-pointer hover:underline" @click="$router.push('/login')">
                立即登录
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/index'

const router = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  
  loading.value = true
  
  try {
    const response = await api.post('/auth/register', {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password
    })
    
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('username', response.data.user.username)
    localStorage.setItem('isLoggedIn', 'true')
    
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = '注册失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script>
