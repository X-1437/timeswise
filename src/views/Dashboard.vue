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
            @click="showCreateDialog = true"
            class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all scale-100 active:scale-95"
          >
            <span class="material-symbols-outlined">add</span>
            <span>新建项目</span>
          </button>
        </div>
        
        <div v-if="loading" class="text-center py-12">
          <span class="material-symbols-outlined text-4xl animate-spin text-primary">sync</span>
          <p class="mt-4 text-slate-500">加载中...</p>
        </div>
        
        <template v-else>
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
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ formatDate(project.updated_at) }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span class="material-symbols-outlined text-sm">analytics</span>
                    <span>{{ project.data_rows || 0 }} 条数据</span>
                  </div>
                  <button @click.stop="deleteProject(project.id)" class="text-red-500 hover:text-red-700 text-xs">
                    删除
                  </button>
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
                <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">{{ formatDate(project.updated_at) }}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2 text-xs text-slate-400">
                    <span class="material-symbols-outlined text-sm">schedule</span>
                    <span>步骤 {{ getStepNumber(project.status) }} / 7</span>
                  </div>
                  <button @click.stop="deleteProject(project.id)" class="text-red-500 hover:text-red-700 text-xs">
                    删除
                  </button>
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
              @click="showCreateDialog = true"
              class="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 mx-auto"
            >
              <span class="material-symbols-outlined">add_circle</span>
              <span>开始新的分析</span>
            </button>
          </div>
          
          <div v-else class="mt-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
            <button 
              @click="showCreateDialog = true"
              class="bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-3 px-6 rounded-lg shadow hover:shadow-md transition-all flex items-center gap-2 mx-auto"
            >
              <span class="material-symbols-outlined">add_circle</span>
              <span>开始新的分析</span>
            </button>
          </div>
        </template>
      </div>
    </div>
    
    <!-- 创建项目弹窗 -->
    <Teleport to="body">
      <div v-if="showCreateDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="showCreateDialog = false">
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">新建项目</h3>
          <form @submit.prevent="handleCreateProject">
            <div class="mb-4">
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">项目名称</label>
              <input 
                v-model="newProjectName" 
                type="text" 
                required
                class="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="请输入项目名称"
              />
            </div>
            <div class="flex gap-3 justify-end">
              <button 
                type="button"
                @click="showCreateDialog = false"
                class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                取消
              </button>
              <button 
                type="submit"
                :disabled="creating"
                class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {{ creating ? '创建中...' : '创建' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import api from '../api/index'

const router = useRouter()

const maxDisplay = 6
const projects = ref([])
const loading = ref(true)
const showCreateDialog = ref(false)
const newProjectName = ref('')
const creating = ref(false)

const completedProjects = computed(() => {
  return projects.value.filter(p => p.status === 'completed')
})

const inProgressProjects = computed(() => {
  return projects.value.filter(p => p.status !== 'completed')
})

const displayedCompletedProjects = computed(() => {
  return completedProjects.value.slice(0, maxDisplay)
})

const displayedInProgressProjects = computed(() => {
  return inProgressProjects.value.slice(0, maxDisplay)
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStepNumber = (status) => {
  const statusMap = {
    'draft': 1,
    'data_config': 2,
    'eda': 3,
    'preprocessing': 4,
    'feature': 5,
    'feature_engineering': 5,
    'forecast': 6,
    'forecasting': 6,
    'completed': 7
  }
  return statusMap[status] || 1
}

const loadProjects = async () => {
  loading.value = true
  try {
    const response = await api.get('/projects')
    projects.value = response.data.items || []
  } catch (error) {
    console.error('加载项目失败:', error)
  } finally {
    loading.value = false
  }
}

const handleCreateProject = async () => {
  if (!newProjectName.value.trim()) return
  
  creating.value = true
  try {
    const response = await api.post('/projects', {
      name: newProjectName.value
    })
    
    showCreateDialog.value = false
    newProjectName.value = ''
    
    projects.value.unshift(response.data)
    
    router.push('/data-import')
  } catch (error) {
    console.error('创建项目失败:', error)
    alert('创建项目失败，请稍后重试')
  } finally {
    creating.value = false
  }
}

const deleteProject = async (projectId) => {
  if (!confirm('确定要删除这个项目吗？')) return
  
  try {
    await api.delete(`/projects/${projectId}`)
    projects.value = projects.value.filter(p => p.id !== projectId)
  } catch (error) {
    console.error('删除项目失败:', error)
    alert('删除项目失败，请稍后重试')
  }
}

const createNewProject = async () => {
  try {
    const response = await api.post('/projects', {
      name: `项目 ${new Date().toLocaleString('zh-CN')}`
    })
    const project = response.data
    localStorage.setItem('currentProjectId', project.id)
    localStorage.removeItem('projectData')
    router.push('/data-import')
  } catch (error) {
    console.error('创建项目失败:', error)
    alert('创建项目失败，请稍后重试')
  }
}

const continueProject = (project) => {
  localStorage.setItem('currentProjectId', project.id)
  localStorage.setItem('projectData', JSON.stringify(project))
  
  const status = project.status || 'draft'
  const lastPage = localStorage.getItem('lastPage')
  
  const stepRoutes = {
    'draft': '/data-import',
    'data_config': '/data-import',
    'eda': '/eda',
    'preprocessing': '/preprocessing',
    'feature': lastPage || '/feature-engineering',
    'feature_engineering': lastPage || '/feature-engineering',
    'forecast': '/forecasting',
    'forecasting': '/forecasting',
    'completed': '/export'
  }
  
  let route = stepRoutes[status] || lastPage || '/feature-engineering'
  
  router.push(route)
}

const viewProject = (project) => {
  localStorage.setItem('currentProjectId', project.id)
  localStorage.setItem('projectData', JSON.stringify(project))
  
  router.push('/export')
}

onMounted(() => {
  loadProjects()
})
</script>
