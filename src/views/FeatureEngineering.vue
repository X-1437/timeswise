<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <span class="cursor-pointer hover:text-primary" @click="$router.push('/dashboard')">项目主页</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-slate-900 dark:text-slate-100 font-medium">特征工程</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">特征工程</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">通过时域和频域特征提取，增强时间序列数据的表达能力以提高预测精度。</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8 mb-8">
          <div 
            @click="$router.push('/feature-engineering/time')"
            class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-primary text-2xl">schedule</span>
              </div>
              <span 
                class="px-2 py-1 rounded text-xs font-medium"
                :class="timeCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
              >
                {{ timeCompleted ? '已完成' : '未完成' }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">时域特征</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">趋势、季节性、自相关性、滞后、滚动统计、差分特征</p>
            <div class="flex items-center gap-2 text-primary text-sm font-medium">
              <span>点击进入分析</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
          
          <div 
            @click="$router.push('/feature-engineering/freq')"
            class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border-2 border-slate-200 dark:border-slate-800 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="size-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <span class="material-symbols-outlined text-purple-600 dark:text-purple-400 text-2xl">wave</span>
              </div>
              <span 
                class="px-2 py-1 rounded text-xs font-medium"
                :class="freqCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'"
              >
                {{ freqCompleted ? '已完成' : '未完成' }}
              </span>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">频域特征</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">FFT、小波变换、功率谱密度、频谱图</p>
            <div class="flex items-center gap-2 text-primary text-sm font-medium">
              <span>点击进入分析</span>
              <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
        
        <div class="flex gap-4">
          <button @click="handleCancel" class="flex-1 px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
            取消
          </button>
          <button @click="goToForecasting" class="flex-1 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
            下一步：朴素预测
          </button>
        </div>
      </div>
    </div>
    
    <ConfirmDialog 
      v-model="showConfirmDialog" 
      @confirm="confirmCancel" 
      @cancel="cancelConfirm"
      title="确认退出"
      message="是否保存当前进度到历史记录？"
      confirmText="是"
      cancelText="否"
      icon="warning"
    />
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()

const showConfirmDialog = ref(false)
const timeCompleted = ref(false)
const freqCompleted = ref(false)

const checkStatus = () => {
  const timeStatus = localStorage.getItem('timeFeatureCompleted')
  const freqStatus = localStorage.getItem('freqFeatureCompleted')
  timeCompleted.value = timeStatus === 'true'
  freqCompleted.value = freqStatus === 'true'
}

const handleCancel = () => {
  showConfirmDialog.value = true
}

const confirmCancel = () => {
  showConfirmDialog.value = false
  localStorage.removeItem('projectData')
  localStorage.removeItem('timeFeatureOptions')
  localStorage.removeItem('freqFeatureOptions')
  localStorage.removeItem('timeFeatureCompleted')
  localStorage.removeItem('freqFeatureCompleted')
  router.push('/dashboard')
}

const cancelConfirm = () => {
  showConfirmDialog.value = false
}

const goToForecasting = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId) {
    try {
      await api.patch(`/projects/${projectId}`, { status: 'forecast' })
    } catch (error) {
      console.error('更新项目状态失败:', error)
    }
  }
  localStorage.removeItem('lastPage')
  router.push('/forecasting')
}

onMounted(() => {
  checkStatus()
})
</script>