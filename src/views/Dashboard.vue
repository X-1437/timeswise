<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">项目中心</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">管理并开启您的时间序列分析项目</p>
          </div>
          <button 
            @click="createNewProject"
            class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all scale-100 active:scale-95"
          >
            <span class="material-symbols-outlined">add</span>
            <span>新建项目</span>
          </button>
        </div>
        
        <div v-if="completedProjects.length > 0" class="mb-8">
          <h2 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">已完成项目</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="project in displayedCompletedProjects" 
              :key="project.id"
              class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              @click="viewProject(project)"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="size-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span class="material-symbols-outlined text-green-600 dark:text-green-400">task_alt</span>
                </div>
                <span class="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">已完成</span>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{{ project.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ project.time }}</p>
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <span class="material-symbols-outlined text-sm">analytics</span>
                <span>{{ project.data?.data?.length || 0 }} 条数据</span>
              </div>
            </div>
          </div>
          <div v-if="completedProjects.length > maxDisplay" class="mt-4 text-center">
            <span class="text-sm text-slate-500">还有 {{ completedProjects.length - maxDisplay }} 个已完成项目</span>
          </div>
        </div>
        
        <div v-if="inProgressProjects.length > 0" class="mb-8">
          <h2 class="text-lg font-bold text-slate-700 dark:text-slate-300 mb-4">进行中项目</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="project in displayedInProgressProjects" 
              :key="project.id"
              class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              @click="continueProject(project)"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="size-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <span class="material-symbols-outlined text-amber-600 dark:text-amber-400">pending</span>
                </div>
                <span class="px-2 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">进行中</span>
              </div>
              <h3 class="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors">{{ project.name }}</h3>
              <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ project.time }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs text-slate-400">
                  <span class="material-symbols-outlined text-sm">schedule</span>
                  <span>步骤 {{ project.currentStep || 1 }} / 6</span>
                </div>
                <button class="text-xs text-primary font-medium hover:underline">继续</button>
              </div>
            </div>
          </div>
          <div v-if="inProgressProjects.length > maxDisplay" class="mt-4 text-center">
            <span class="text-sm text-slate-500">还有 {{ inProgressProjects.length - maxDisplay }} 个进行中项目</span>
          </div>
        </div>
        
        <div v-if="completedProjects.length === 0 && inProgressProjects.length === 0" class="mt-12 bg-primary/5 dark:bg-primary/10 rounded-2xl border-2 border-dashed border-primary/20 p-12 text-center">
          <div class="size-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-primary text-4xl">waving_hand</span>
          </div>
          <h2 class="text-xl font-bold mb-2">欢迎回来</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">点击下方按钮开始新的分析流程，我们将协助您完成从数据导入到报告生成的所有步骤。</p>
          <button 
            @click="createNewProject"
            class="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 mx-auto"
          >
            <span class="material-symbols-outlined">add_circle</span>
            <span>开始新的分析</span>
          </button>
        </div>
        
        <div v-else class="mt-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
          <button 
            @click="createNewProject"
            class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2 mx-auto"
          >
            <span class="material-symbols-outlined">add_circle</span>
            <span>开始新的分析</span>
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const router = useRouter()

const maxDisplay = 6
const historyRecords = ref([])

const completedProjects = computed(() => {
  return historyRecords.value.filter(record => record.status === '已完成')
})

const inProgressProjects = computed(() => {
  return historyRecords.value.filter(record => record.status === '进行中')
})

const displayedCompletedProjects = computed(() => {
  return completedProjects.value.slice(0, maxDisplay)
})

const displayedInProgressProjects = computed(() => {
  return inProgressProjects.value.slice(0, maxDisplay)
})

const loadHistory = () => {
  const records = JSON.parse(localStorage.getItem('historyRecords') || '[]')
  historyRecords.value = records
}

const createNewProject = () => {
  localStorage.removeItem('projectData')
  router.push('/data-import')
}

const continueProject = (project) => {
  if (project.data) {
    localStorage.setItem('projectData', JSON.stringify(project.data))
  }
  
  const stepRoutes = ['/', '/data-import', '/eda', '/preprocessing', '/feature-engineering', '/forecasting', '/export']
  const route = stepRoutes[project.currentStep] || '/data-import'
  router.push(route)
}

const viewProject = (project) => {
  if (project.data) {
    localStorage.setItem('projectData', JSON.stringify(project.data))
  }
  
  const stepRoutes = ['/', '/data-import', '/eda', '/preprocessing', '/feature-engineering', '/forecasting', '/export']
  const route = stepRoutes[project.currentStep] || '/export'
  router.push(route)
}

onMounted(() => {
  loadHistory()
})
</script>
