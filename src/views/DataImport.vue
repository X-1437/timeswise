<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="mb-8">
          <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <a class="hover:text-primary transition-colors cursor-pointer" @click="$router.push('/dashboard')">项目中心</a>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-slate-900 dark:text-slate-100 font-medium">数据接入</span>
          </nav>
          <div class="flex flex-col gap-2">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white">第 1 步：数据接入</h2>
            <p class="text-slate-500 dark:text-slate-400">请上传您的数据集并配置基本参数以开始分析。</p>
          </div>
        </div>
        
        <div class="flex gap-8">
          <aside class="w-80 flex-shrink-0 space-y-6">
            <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 h-[500px] flex flex-col">
              <h3 class="text-lg font-semibold mb-6 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">cloud_upload</span>
                数据上传
              </h3>
              
              <div 
                class="flex-1 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer group bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center"
                :class="uploading ? 'opacity-50 cursor-not-allowed' : ''"
                @click="!uploading && triggerFileInput()"
                @dragover.prevent
                @drop.prevent="!uploading && handleDrop"
              >
                <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept=".csv,.xlsx,.xls" />
                <span v-if="uploading" class="material-symbols-outlined text-4xl text-primary animate-spin mb-2">sync</span>
                <span v-else class="material-symbols-outlined text-4xl text-slate-400 group-hover:text-primary transition-colors mb-2">upload_file</span>
                <p class="text-sm font-medium text-slate-900 dark:text-white mb-1">{{ fileName || '点击或拖拽文件到此处' }}</p>
                <p class="text-xs text-slate-500">支持 CSV、Excel 格式</p>
              </div>
              
              <div class="space-y-4 mt-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">选择时间列</label>
                  <div class="relative">
                    <select v-model="selectedTimeCol" :disabled="!hasData" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none disabled:opacity-50">
                      <option value="">请选择列...</option>
                      <option v-for="col in detectedColumns" :key="col.value" :value="col.value">{{ col.label }} {{ col.isTime ? '(时间列)' : '' }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">选择目标变量</label>
                  <div class="relative">
                    <select v-model="selectedTargetCol" :disabled="!hasData" class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none disabled:opacity-50">
                      <option value="">请选择变量...</option>
                      <option v-for="col in targetColumnOptions" :key="col.value" :value="col.value">{{ col.label }}</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-primary/5 border border-primary/20 p-4 rounded-lg">
              <h4 class="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-sm">info</span>
                使用建议
              </h4>
              <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                为了获得最佳预测结果，请确保您的数据按时间顺序排列，且没有大量缺失值。系统将自动识别常见的时间格式。
              </p>
            </div>
          </aside>
          
          <section class="flex-1 min-w-0">
            <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[500px]">
              <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="material-symbols-outlined text-slate-400">table_view</span>
                  <h3 class="text-lg font-semibold">数据预览</h3>
                  <span v-if="hasData" class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">第 {{ currentPage }} / {{ totalPages }} 页</span>
                </div>
                <div class="flex items-center gap-2">
                  <div v-if="showSearch" class="relative">
                    <input 
                      v-model="searchKeyword" 
                      type="text" 
                      placeholder="搜索..."
                      class="w-48 px-3 py-1.5 pl-8 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                      @input="handleSearch"
                    />
                    <span class="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                  </div>
                  <button v-if="hasData" @click="showSearch = !showSearch" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500" :class="showSearch ? 'bg-primary/10 text-primary' : ''">
                    <span class="material-symbols-outlined text-xl">search</span>
                  </button>
                </div>
              </div>
              
              <div v-if="!hasData" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">upload_file</span>
                  <p class="text-slate-500 dark:text-slate-400">请上传您的数据</p>
                </div>
              </div>
              
              <div v-else-if="loadingPreview" class="flex-1 flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-4xl animate-spin text-primary mb-2">sync</span>
                  <p class="text-slate-500">加载数据中...</p>
                </div>
              </div>
              
              <div v-else class="overflow-x-auto flex-1">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-slate-50 dark:bg-slate-800/50">
                      <th v-for="header in tableHeaders" :key="header" class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr v-for="(row, index) in paginatedData" :key="index" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-6 py-4 text-sm" :class="getCellClass(cell, cellIndex)">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="hasData" class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                <div class="flex items-center justify-between text-xs text-slate-500">
                  <span>共 {{ filteredData.length }} 条记录</span>
                  <div class="flex gap-2">
                    <button 
                      @click="prevPage" 
                      :disabled="currentPage <= 1"
                      class="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    <button 
                      @click="nextPage" 
                      :disabled="currentPage >= totalPages"
                      class="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div class="mt-10 flex justify-end gap-4">
          <button @click="handleCancel" class="px-6 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            取消
          </button>
          <button 
            @click="loadData"
            :disabled="!hasData || !selectedTimeCol || !selectedTargetCol || saving"
            class="px-8 py-2 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? '保存中...' : '加载数据' }}
          </button>
        </div>
      </div>
    </div>
    
    <ConfirmDialog 
      v-model="showConfirmDialog" 
      @confirm="confirmCancel" 
      @cancel="goHome"
      title="确认退出"
      :message="hasData ? '是否保存当前进度到历史记录？' : '确定要退出吗？'"
      confirmText="是"
      cancelText="否"
      icon="warning"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import api from '../api/index'

const router = useRouter()

const fileInput = ref(null)
const fileName = ref('')
const selectedTimeCol = ref('')
const selectedTargetCol = ref('')
const hasData = ref(false)
const detectedColumns = ref([])
const tableHeaders = ref([])
const allData = ref([])
const showSearch = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = 10
const showConfirmDialog = ref(false)
const uploading = ref(false)
const saving = ref(false)
const loadingPreview = ref(false)

onMounted(async () => {
  let projectId = localStorage.getItem('currentProjectId')
  console.log('currentProjectId:', projectId)
  
  if (!projectId) {
    try {
      const response = await api.post('/projects', {
        name: `项目 ${new Date().toLocaleString('zh-CN')}`
      })
      projectId = response.data.id
      localStorage.setItem('currentProjectId', projectId)
      console.log('Created new project:', projectId)
    } catch (error) {
      console.error('创建项目失败:', error)
    }
  }
  
  if (projectId) {
    await loadProjectData(projectId)
  }
})

const loadProjectData = async (projectId) => {
  try {
    const response = await api.get(`/projects/${projectId}`)
    const project = response.data
    
    if (project.data_config) {
      selectedTimeCol.value = project.data_config.time_column || ''
      selectedTargetCol.value = project.data_config.target_column || ''
    }
    
    if (project.data_file) {
      fileName.value = project.data_file.filename || ''
      await loadColumns(projectId)
    }
  } catch (error) {
    console.error('加载项目数据失败:', error)
  }
}

const targetColumnOptions = computed(() => {
  return detectedColumns.value.filter(col => col.value !== selectedTimeCol.value)
})

const filteredData = computed(() => {
  if (!searchKeyword.value) {
    return allData.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return allData.value.filter(row => 
    row.some(cell => String(cell).toLowerCase().includes(keyword))
  )
})

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize) || 1
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredData.value.slice(start, end)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (file) {
    await uploadFile(file)
  }
}

const handleDrop = async (event) => {
  const file = event.dataTransfer.files[0]
  if (file) {
    await uploadFile(file)
  }
}

const uploadFile = async (file) => {
  const projectId = localStorage.getItem('currentProjectId')
  if (!projectId) {
    alert('请先创建项目')
    return
  }
  
  uploading.value = true
  fileName.value = file.name
  
  const formData = new FormData()
  formData.append('file', file)
  
  try {
    await api.post(`/projects/${projectId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    await loadColumns(projectId)
    
  } catch (error) {
    console.error('上传文件失败:', error)
    alert('上传失败，请稍后重试')
    fileName.value = ''
  } finally {
    uploading.value = false
  }
}

const loadColumns = async (projectId) => {
  loadingPreview.value = true
  
  try {
    const response = await api.get(`/projects/${projectId}/columns`)
    const columns = response.data.columns || []
    
    const timeKeywords = ['time', 'date', 'datetime', 'timestamp', '时间', '日期', '时间戳']
    
    detectedColumns.value = columns.map(col => ({
      value: col.name,
      label: col.name,
      isTime: timeKeywords.some(kw => col.name.toLowerCase().includes(kw))
    })).sort((a, b) => b.isTime - a.isTime)
    
    tableHeaders.value = columns.map(col => col.name)
    
    const responseData = await api.get(`/projects/${projectId}/data?page=1&page_size=100`)
    allData.value = responseData.data.data || []
    
    hasData.value = true
    currentPage.value = 1
    
    const timeCol = detectedColumns.value.find(c => c.isTime)
    if (timeCol) {
      selectedTimeCol.value = timeCol.value
    }
    
    const targetCol = detectedColumns.value.find(c => c.value !== selectedTimeCol.value)
    if (targetCol) {
      selectedTargetCol.value = targetCol.value
    }
    
  } catch (error) {
    console.error('加载列信息失败:', error)
  } finally {
    loadingPreview.value = false
  }
}

const loadData = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  if (!projectId) {
    alert('请先创建项目')
    return
  }
  
  saving.value = true
  
  try {
    await api.post(`/projects/${projectId}/data/configure`, {
      time_column: selectedTimeCol.value,
      target_column: selectedTargetCol.value
    })
    
    router.push('/eda')
  } catch (error) {
    console.error('保存配置失败:', error)
    alert('保存失败，请稍后重试')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  if (hasData.value) {
    showConfirmDialog.value = true
  } else {
    router.push('/dashboard')
  }
}

const goHome = () => {
  showConfirmDialog.value = false
  resetState()
  router.push('/dashboard')
}

const resetState = () => {
  fileName.value = ''
  selectedTimeCol.value = ''
  selectedTargetCol.value = ''
  tableHeaders.value = []
  allData.value = []
  detectedColumns.value = []
  hasData.value = false
  currentPage.value = 1
  searchKeyword.value = ''
  localStorage.removeItem('projectData')
  localStorage.removeItem('currentProjectId')
}

const confirmCancel = async () => {
  saving.value = true
  
  try {
    const projectId = localStorage.getItem('currentProjectId')
    if (projectId) {
      await api.patch(`/projects/${projectId}`, {
        status: 'draft'
      })
    }
  } catch (error) {
    console.error('保存状态失败:', error)
  }
  
  showConfirmDialog.value = false
  resetState()
  router.push('/dashboard')
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleSearch = () => {
  currentPage.value = 1
}

const getCellClass = (cell, index) => {
  if (index === 0) return 'font-medium'
  return 'text-slate-600 dark:text-slate-400'
}
</script>
