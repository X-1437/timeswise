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
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">登录账号</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-2">欢迎回来，请登录您的账号</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户名</label>
              <input 
                v-model="form.username" 
                type="text" 
                required
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">密码</label>
              <input 
                v-model="form.password" 
                type="password" 
                required
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="请输入密码"
              />
            </div>
            
            <button 
              type="submit"
              class="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              登录
            </button>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-slate-500 dark:text-slate-400">
              还没有账号？
              <span class="text-primary font-medium cursor-pointer hover:underline" @click="$router.push('/register')">
                立即注册
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

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  console.log('登录:', form.value)
  localStorage.setItem('isLoggedIn', 'true')
  localStorage.setItem('username', form.value.username)
  router.push('/dashboard')
}
</script>
