<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-2xl mx-auto">
        <div class="mb-8">
          <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <a class="hover:text-primary transition-colors cursor-pointer" @click="$router.push('/dashboard')">首页</a>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-slate-900 dark:text-slate-100 font-medium">账号管理</span>
          </nav>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">账号管理</h1>
        </div>
        
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">person</span>
              基本信息
            </h2>
            
            <div class="flex items-center gap-6 mb-6">
              <div class="size-20 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden flex items-center justify-center">
                <img v-if="profile.avatar" :src="profile.avatar" class="w-full h-full object-cover" />
                <span v-else class="material-symbols-outlined text-3xl text-primary">person</span>
              </div>
              <div>
                <button class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  修改头像
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">用户名</label>
                <input 
                  v-model="profile.username" 
                  type="text" 
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">邮箱</label>
                <input 
                  v-model="profile.email" 
                  type="email" 
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                />
              </div>
            </div>
            
            <div class="mt-6">
              <button @click="saveProfile" class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                保存修改
              </button>
            </div>
          </div>
          
          <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-lg font-bold mb-6 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary">lock</span>
              修改密码
            </h2>
            
            <div class="space-y-4 max-w-md">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">当前密码</label>
                <input 
                  v-model="passwordForm.currentPassword" 
                  type="password" 
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="请输入当前密码"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">新密码</label>
                <input 
                  v-model="passwordForm.newPassword" 
                  type="password" 
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="请输入新密码"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">确认新密码</label>
                <input 
                  v-model="passwordForm.confirmPassword" 
                  type="password" 
                  class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                  placeholder="请再次输入新密码"
                />
              </div>
            </div>
            
            <div class="mt-6">
              <button @click="changePassword" class="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                修改密码
              </button>
            </div>
          </div>
          
          <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-red-500">logout</span>
              退出登录
            </h2>
            <p class="text-slate-500 dark:text-slate-400 mb-4">您确定要退出当前账号吗？</p>
            <button @click="logout" class="px-6 py-2 border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const router = useRouter()

const profile = ref({
  username: '管理员',
  email: 'admin@example.com',
  avatar: ''
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const saveProfile = () => {
  console.log('保存个人信息:', profile.value)
}

const changePassword = () => {
  console.log('修改密码:', passwordForm.value)
}

const logout = () => {
  localStorage.removeItem('isLoggedIn')
  localStorage.removeItem('username')
  localStorage.removeItem('avatar')
  localStorage.removeItem('token')
  localStorage.removeItem('currentProjectId')
  router.push('/')
}
</script>
