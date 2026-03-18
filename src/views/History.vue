<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <nav class="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
            <a class="hover:text-primary transition-colors cursor-pointer" @click="$router.push('/dashboard')">首页</a>
            <span class="material-symbols-outlined text-xs">chevron_right</span>
            <span class="text-slate-900 dark:text-slate-100 font-medium">历史记录</span>
          </nav>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white">历史记录</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">查看您过往的时间序列分析记录</p>
        </div>
        
        <div v-if="historyRecords.length > 0" class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="relative">
                <input 
                  v-model="searchKeyword"
                  type="text" 
                  placeholder="搜索项目..."
                  class="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="刷新">
                <span class="material-symbols-outlined text-sm" @click="loadHistory">refresh</span>
              </button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-800/50">
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">项目名称</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">分析时间</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">当前步骤</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">状态</th>
                  <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr v-for="record in filteredRecords" :key="record.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <span class="material-symbols-outlined text-primary text-sm">analytics</span>
                      </div>
                      <span class="font-medium text-slate-900 dark:text-white">{{ record.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{{ record.time }}</td>
                  <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{{ getStepName(record.currentStep) }}</td>
                  <td class="px-6 py-4">
                    <span class="px-2 py-1 rounded text-xs font-medium" :class="getStatusClass(record.status)">{{ record.status }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <button @click="restoreRecord(record)" class="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">restore</span>
                        恢复
                      </button>
                      <button @click="deleteRecord(record.id)" class="text-red-500 text-sm font-medium hover:underline flex items-center gap-1">
                        <span class="material-symbols-outlined text-sm">delete</span>
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
            <div class="flex items-center justify-between text-sm text-slate-500">
              <span>共 {{ filteredRecords.length }} 条记录</span>
            </div>
          </div>
        </div>
        
        <div v-else class="mt-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
          <div class="size-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-slate-400 text-4xl">history</span>
          </div>
          <h2 class="text-xl font-bold mb-2 text-slate-600 dark:text-slate-400">暂无历史记录</h2>
          <p class="text-slate-500 dark:text-slate-500 mb-6 max-w-sm mx-auto">您还没有完成过时间序列分析项目。开始您的第一次分析吧！</p>
          <button @click="$router.push('/data-import')" class="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 mx-auto">
            <span class="material-symbols-outlined">add_circle</span>
            <span>开始新的分析</span>
          </button>
        </div>
      </div>
    </div>
    
    <ConfirmDialog 
      v-model="showRestoreConfirm" 
      @confirm="confirmRestore" 
      @cancel="cancelRestore"
      title="恢复进度"
      :message="'确定要恢复到「' + (recordToRestore?.name || '') + '」吗？当前未保存的进度将会丢失。'"
      confirmText="恢复"
      cancelText="取消"
      icon="restore"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()

const historyRecords = ref([])
const searchKeyword = ref('')
const showRestoreConfirm = ref(false)
const recordToRestore = ref(null)

const filteredRecords = computed(() => {
  if (!searchKeyword.value) {
    return historyRecords.value
  }
  const keyword = searchKeyword.value.toLowerCase()
  return historyRecords.value.filter(record => 
    record.name.toLowerCase().includes(keyword)
  )
})

const loadHistory = () => {
  const records = JSON.parse(localStorage.getItem('historyRecords') || '[]')
  historyRecords.value = records.map(record => ({
    ...record,
    statusClass: getStatusClass(record.status)
  }))
}

const getStatusClass = (status) => {
  switch(status) {
    case '已完成':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    case '进行中':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
    case '失败':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
  }
}

const getStepName = (step) => {
  const steps = ['未开始', '数据接入', 'EDA', '预处理', '特征工程', '朴素预测', '报告导出']
  return steps[step] || '未知'
}

const restoreRecord = (record) => {
  recordToRestore.value = record
  showRestoreConfirm.value = true
}

const confirmRestore = () => {
  if (recordToRestore.value && recordToRestore.value.data) {
    localStorage.setItem('projectData', JSON.stringify(recordToRestore.value.data))
    
    const stepRoutes = ['/', '/data-import', '/eda', '/preprocessing', '/feature-engineering', '/forecasting', '/export']
    const route = stepRoutes[recordToRestore.value.currentStep] || '/data-import'
    router.push(route)
  }
  showRestoreConfirm.value = false
  recordToRestore.value = null
}

const cancelRestore = () => {
  showRestoreConfirm.value = false
  recordToRestore.value = null
}

const deleteRecord = (id) => {
  historyRecords.value = historyRecords.value.filter(record => record.id !== id)
  localStorage.setItem('historyRecords', JSON.stringify(historyRecords.value))
}

onMounted(() => {
  loadHistory()
})
</script>
