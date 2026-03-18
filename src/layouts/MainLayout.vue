<template>
  <div class="flex flex-col min-h-screen font-sans">
    <header class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <div class="text-primary flex items-center cursor-pointer" @click="$router.push('/')">
          <span class="material-symbols-outlined text-3xl">query_stats</span>
        </div>
        <h2 class="text-xl font-bold tracking-tight text-primary cursor-pointer" @click="$router.push('/')">TimeWise</h2>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">notifications</span>
        </button>
        <div class="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2"></div>
        
        <template v-if="isLoggedIn">
          <div class="flex items-center gap-3 cursor-pointer group" @click="$router.push('/profile')">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-semibold leading-none">{{ username }}</p>
              <p class="text-xs text-slate-500 mt-1">分析师账号</p>
            </div>
            <div class="size-10 rounded-full bg-primary/20 border-2 border-primary/30 overflow-hidden flex items-center justify-center">
              <img v-if="avatar" :src="avatar" class="w-full h-full object-cover" />
              <span v-else class="material-symbols-outlined text-primary">person</span>
            </div>
          </div>
        </template>
        <template v-else>
          <button @click="$router.push('/login')" class="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
            登录
          </button>
        </template>
      </div>
    </header>
    
    <div class="flex flex-1">
      <Sidebar :currentStep="currentStep" :collapsed="sidebarCollapsed" @toggle-collapse="toggleSidebar" @navigate="handleNavigate" />
      <main class="flex-1 overflow-y-auto transition-all duration-300" :class="sidebarCollapsed ? 'ml-0' : ''">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'

const route = useRoute()
const router = useRouter()

const currentStep = computed(() => route.meta.step || 0)
const sidebarCollapsed = ref(false)

const isLoggedIn = ref(false)
const username = ref('')
const avatar = ref('')

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
  username.value = localStorage.getItem('username') || '管理员'
  avatar.value = localStorage.getItem('avatar') || ''
})

const handleNavigate = (path) => {
  router.push(path)
}

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>
