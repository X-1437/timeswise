<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <span class="cursor-pointer hover:text-primary" @click="$router.push('/dashboard')">项目主页</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-slate-900 dark:text-slate-100 font-medium">数据预处理</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">数据预处理</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">对原始时间序列数据进行清洗、重采样及缺失值处理，为后续建模建立坚实的数据基础。</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">auto_fix_high</span>
                预处理策略
              </h2>
              
              <div class="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                <div class="p-4 rounded-lg border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="enabledStrategies.resampling" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="font-bold text-slate-800 dark:text-slate-200">数据重采样</span>
                    </div>
                    <span class="material-symbols-outlined text-primary" :class="enabledStrategies.resampling ? 'opacity-100' : 'opacity-30'">check_circle</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">调整时间序列频率，如从"日"聚合为"周"或"月"。</p>
                  <div v-if="enabledStrategies.resampling">
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">聚合方式</label>
                    <div class="relative">
                      <select v-model="selectedOptions.resampling" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none">
                        <option value="15min">15分钟</option>
                        <option value="1h">1小时</option>
                        <option value="1d">日</option>
                        <option value="1w">周</option>
                        <option value="1M">月</option>
                        <option value="1y">年</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
                
                <div class="p-4 rounded-lg border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="enabledStrategies.missingValue" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="font-bold text-slate-800 dark:text-slate-200">缺失值插补</span>
                    </div>
                    <span class="material-symbols-outlined text-primary" :class="enabledStrategies.missingValue ? 'opacity-100' : 'opacity-30'">check_circle</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">使用线性插值、均值填充或前向填充修复断档。</p>
                      <div v-if="enabledStrategies.missingValue">
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">插补方法</label>
                    <div class="relative">
                      <select v-model="selectedOptions.missingValue" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none">
                        <option value="linear">线性插值</option>
                        <option value="mean">均值填充</option>
                        <option value="median">中位数填充</option>
                        <option value="forward">前向填充</option>
                        <option value="backward">后向填充</option>
                        <option value="spline">样条插值</option>
                        <option value="knn">KNN插补</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
                
                <div class="p-4 rounded-lg border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="enabledStrategies.outlier" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="font-bold text-slate-800 dark:text-slate-200">异常值检测</span>
                    </div>
                    <span class="material-symbols-outlined text-primary" :class="enabledStrategies.outlier ? 'opacity-100' : 'opacity-30'">check_circle</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">基于统计阈值识别并平滑突发性的错误波峰。</p>
                  <div v-if="enabledStrategies.outlier">
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">检测方法</label>
                    <div class="relative">
                      <select v-model="selectedOptions.outlier" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none">
                        <option value="zscore">Z-Score (3σ原则)</option>
                        <option value="iqr">IQR四分位距</option>
                        <option value="mad">MAD绝对中位差</option>
                        <option value="isolation">孤立森林</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                      <div class="mt-3">
                      <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">处理方式</label>
                      <div class="relative">
                        <select v-model="selectedOptions.outlierMethod" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none">
                          <option value="remove">移除</option>
                          <option value="smooth">平滑处理</option>
                          <option value="clip">裁剪边界</option>
                          <option value="flag">仅标记不处理</option>
                        </select>
                        <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="p-4 rounded-lg border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2">
                      <input type="checkbox" v-model="enabledStrategies.noise" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="font-bold text-slate-800 dark:text-slate-200">噪声评估及处理</span>
                    </div>
                    <span class="material-symbols-outlined text-primary" :class="enabledStrategies.noise ? 'opacity-100' : 'opacity-30'">check_circle</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">评估数据噪声水平并使用滤波算法降低噪声干扰。</p>
                  <div v-if="enabledStrategies.noise">
                    <label class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">滤波方法</label>
                    <div class="relative">
                      <select v-model="selectedOptions.noise" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-3 pr-10 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none appearance-none">
                        <option value="moving_avg">移动平均</option>
                        <option value="ewma">指数加权移动平均</option>
                        <option value="kalman">卡尔曼滤波</option>
                        <option value="savgol">Savitzky-Golay滤波</option>
                        <option value="wavelet">小波去噪</option>
                      </select>
                      <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 space-y-4">
                <button @click="executePreprocessing" class="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <span class="material-symbols-outlined">auto_fix_high</span>
                  执行预处理
                </button>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-medium">
                    <span>清洗进度</span>
                    <span>{{ progress }}%</span>
                  </div>
                  <div class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-primary rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
                  </div>
                  <p v-if="progress < 100" class="text-[10px] text-slate-400 text-right italic">{{ progressText }}</p>
                </div>
              </div>
            </div>
            
            <div class="flex gap-4">
              <button @click="handleCancel" class="flex-1 px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                取消
              </button>
              <button @click="$router.push('/eda')" class="flex-1 px-6 py-2.5 rounded-lg border border-primary/20 hover:border-primary text-primary font-semibold transition-all hover:bg-primary/5 active:scale-[0.98]">
                上一步：EDA
              </button>
            </div>
          </div>
          
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">auto_fix_high</span>
                  数据预处理效果预览
                </h2>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2"><div class="w-4 h-0.5 bg-slate-300"></div><span class="text-xs text-slate-500">原始序列</span></div>
                  <div class="flex items-center gap-2"><div class="w-4 h-0.5 bg-primary"></div><span class="text-xs text-slate-500">清洗后序列</span></div>
                </div>
              </div>
              
              <div v-if="!hasData" class="h-[450px] flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">upload_file</span>
                  <p class="text-slate-500 dark:text-slate-400">请先在数据接入页面上传数据</p>
                </div>
              </div>
              
              <div v-else ref="chartRef" class="h-[450px]"></div>
              
              <div v-if="hasData" class="grid grid-cols-3 gap-4 mt-6">
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">缺失数据率</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ missingRate }}%</p>
                  <div class="mt-2 flex items-center gap-1 text-[10px] text-green-500 font-medium">
                    <span class="material-symbols-outlined text-xs">check_circle</span>已完成插补
                  </div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">异常值处理</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ outlierCount }}</p>
                  <div class="mt-2 flex items-center gap-1 text-[10px] text-blue-500 font-medium">
                    <span class="material-symbols-outlined text-xs">info</span>个点已被平滑
                  </div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">数据行数</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ dataRowCount }}</p>
                  <div class="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <span class="material-symbols-outlined text-xs">schedule</span>待处理
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex gap-4">
              <button @click="handleExport" class="flex-1 px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-lg">download</span>
                <span>导出处理后的数据</span>
              </button>
              <button @click="handleSaveAndNext" class="flex-1 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                保存并进入下一步
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <ConfirmDialog 
      v-model="showConfirmDialog" 
      @confirm="confirmCancel" 
      @cancel="goHome"
      title="确认退出"
      message="是否保存当前进度到历史记录？"
      confirmText="是"
      cancelText="否"
      icon="warning"
    />
  </MainLayout>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import api from '../api/index'

const router = useRouter()

const chartRef = ref(null)
let chart = null
const showConfirmDialog = ref(false)

const progress = ref(0)
const progressText = ref('准备就绪')
const loading = ref(false)

const projectData = ref(null)
const originalProjectData = ref(null)
const hasData = ref(false)
const preprocessingResult = ref(null)

watch(projectData, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      initChart()
    }, 500)
  }
})

const missingRate = ref('0.00')
const outlierCount = ref(0)
const dataRowCount = ref(0)

const enabledStrategies = reactive({
  resampling: false,
  missingValue: false,
  outlier: true,
  noise: false
})

const selectedOptions = reactive({
  resampling: '1d',
  missingValue: 'linear',
  outlier: 'zscore',
  outlierMethod: 'smooth',
  noise: 'moving_avg'
})

const loadProjectData = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  if (!projectId) {
    const savedData = localStorage.getItem('projectData')
    if (savedData) {
      projectData.value = JSON.parse(savedData)
      hasData.value = true
      calculateStats()
      initChart()
    }
    return
  }

  loading.value = true
  try {
    const response = await api.get(`/projects/${projectId}`)
    const loadedData = {
      data: response.data.preview || [],
      headers: response.data.columns?.map(c => c.name) || [],
      targetCol: response.data.data_config?.target_column || '',
      timeCol: response.data.data_config?.time_column || ''
    }
    projectData.value = loadedData
    if (!originalProjectData.value) {
      originalProjectData.value = JSON.parse(JSON.stringify(loadedData))
    }
    hasData.value = true
    calculateStats()
    initChart()
  } catch (error) {
    console.error('获取项目数据失败:', error)
    const savedData = localStorage.getItem('projectData')
    if (savedData) {
      const loadedData = JSON.parse(savedData)
      projectData.value = loadedData
      if (!originalProjectData.value) {
        originalProjectData.value = JSON.parse(JSON.stringify(loadedData))
      }
      hasData.value = true
      calculateStats()
      initChart()
    }
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  if (!projectData.value) return
  
  const data = projectData.value.data
  const headers = projectData.value.headers
  
  dataRowCount.value = data.length
  
  const totalCells = data.length * headers.length
  let missingCount = 0
  
  data.forEach(row => {
    row.forEach(cell => {
      if (cell === '' || cell === null || cell === undefined || cell === 'NA' || cell === 'N/A' || cell === 'null') {
        missingCount++
      }
    })
  })
  
  missingRate.value = totalCells > 0 ? (missingCount / totalCells * 100).toFixed(2) : '0.00'
  
  const targetColIndex = headers.indexOf(projectData.value.targetCol)
  const numericValues = data
    .map(row => parseFloat(row[targetColIndex]))
    .filter(v => !isNaN(v))
  
  if (numericValues.length > 0) {
    const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
    const variance = numericValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / numericValues.length
    const std = Math.sqrt(variance)
    
    outlierCount.value = numericValues.filter(val => Math.abs(val - mean) > 3 * std).length
  }
}

const executePreprocessing = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  
  savePreprocessingOptions()
  
  if (!originalProjectData.value) {
    originalProjectData.value = JSON.parse(JSON.stringify(projectData.value))
  }
  
  progress.value = 0
  progressText.value = '正在执行预处理...'
  
  const steps = []
  if (enabledStrategies.resampling) steps.push('重采样')
  if (enabledStrategies.missingValue) steps.push('插补')
  if (enabledStrategies.outlier) steps.push('异常值检测')
  if (enabledStrategies.noise) steps.push('去噪')
  
  if (projectId) {
    try {
      const response = await api.post(`/projects/${projectId}/preprocessing`, {
        resampling: {
          enabled: enabledStrategies.resampling,
          freq: selectedOptions.resampling
        },
        missing_value: {
          enabled: enabledStrategies.missingValue,
          method: selectedOptions.missingValue
        },
        outlier: {
          enabled: enabledStrategies.outlier,
          method: selectedOptions.outlier,
          handling: selectedOptions.outlierMethod
        },
        noise: {
          enabled: enabledStrategies.noise,
          filter: selectedOptions.noise
        }
      })
      
      preprocessingResult.value = response.data
      
      if (response.data.metrics) {
        missingRate.value = response.data.metrics.missing_filled > 0 ? 
          ((response.data.metrics.missing_filled / response.data.metrics.original_rows) * 100).toFixed(2) : '0.00'
        outlierCount.value = response.data.metrics.outliers_handled || 0
        dataRowCount.value = response.data.metrics.processed_rows || 0
      }
      
      if (response.data.preview && response.data.columns) {
        projectData.value = {
          data: response.data.preview,
          headers: response.data.columns,
          targetCol: projectData.value.targetCol,
          timeCol: projectData.value.timeCol
        }
      }
      
      progress.value = 100
      progressText.value = '预处理完成！'
      initChart()
    } catch (error) {
      console.error('预处理失败:', error)
      
      let currentProgress = 0
      const fastInterval = setInterval(() => {
        currentProgress += 10
        if (currentProgress >= 100) {
          progress.value = 100
          progressText.value = '预处理完成！'
          clearInterval(fastInterval)
        } else {
          progress.value = currentProgress
          const stepIndex = Math.floor(currentProgress / (100 / Math.max(steps.length, 1)))
          progressText.value = `正在执行${steps[Math.min(stepIndex, steps.length - 1)]}...`
        }
      }, 150)
    }
  } else {
    let currentProgress = 0
    const fastInterval = setInterval(() => {
      currentProgress += 10
      if (currentProgress >= 100) {
        progress.value = 100
        progressText.value = '预处理完成！'
        clearInterval(fastInterval)
      } else {
        progress.value = currentProgress
        const stepIndex = Math.floor(currentProgress / (100 / Math.max(steps.length, 1)))
        progressText.value = `正在执行${steps[Math.min(stepIndex, steps.length - 1)]}...`
      }
    }, 150)
  }
}

const savePreprocessingOptions = () => {
  const options = {
    enabledStrategies: { ...enabledStrategies },
    selectedOptions: { ...selectedOptions }
  }
  localStorage.setItem('preprocessingOptions', JSON.stringify(options))
}

const initChart = () => {
  if (chartRef.value && projectData.value) {
    if (!projectData.value.data || projectData.value.data.length === 0) {
      console.warn('没有预览数据')
      return
    }
    if (chart) {
      chart.dispose()
    }
    chart = echarts.init(chartRef.value)

    const headers = projectData.value.headers
    const data = projectData.value.data
    let targetColIndex = headers.indexOf(projectData.value.targetCol)
    let timeColIndex = projectData.value.timeCol ? headers.indexOf(projectData.value.timeCol) : -1

    if (targetColIndex === -1 && data.length > 0) {
      for (let i = 0; i < headers.length; i++) {
        const hasNumeric = data.some(row => !isNaN(parseFloat(row[i])))
        if (hasNumeric) {
          targetColIndex = i
          break
        }
      }
    }

    if (targetColIndex === -1) {
      console.warn('没有找到可用的数值列')
      return
    }

    const xLabels = data.map((row, i) => {
      if (timeColIndex >= 0 && row[timeColIndex]) {
        return row[timeColIndex]
      }
      return `点${i + 1}`
    })

    const numericValues = data
      .map(row => parseFloat(row[targetColIndex]))
      .filter(v => !isNaN(v))

    if (numericValues.length === 0) {
      console.warn('没有找到有效的数值数据')
      return
    }

    const step = Math.max(1, Math.floor(numericValues.length / 12))
    const sampledData = []
    const sampledLabels = []
    for (let i = 0; i < numericValues.length; i += step) {
      sampledData.push(numericValues[i])
      sampledLabels.push(xLabels[i])
    }

    let originalData = null
    let originalLabels = null
    
    if (originalProjectData.value && preprocessingResult.value) {
      const origHeaders = originalProjectData.value.headers
      const origData = originalProjectData.value.data
      let origTargetIdx = origHeaders.indexOf(originalProjectData.value.targetCol)
      let origTimeIdx = originalProjectData.value.timeCol ? origHeaders.indexOf(originalProjectData.value.timeCol) : -1

      if (origTargetIdx === -1 && origData.length > 0) {
        for (let i = 0; i < origHeaders.length; i++) {
          const hasNumeric = origData.some(row => !isNaN(parseFloat(row[i])))
          if (hasNumeric) {
            origTargetIdx = i
            break
          }
        }
      }

      if (origTargetIdx >= 0) {
        originalLabels = origData.map((row, i) => {
          if (origTimeIdx >= 0 && row[origTimeIdx]) {
            return row[origTimeIdx]
          }
          return `点${i + 1}`
        })
        
        const origValues = origData
          .map(row => parseFloat(row[origTargetIdx]))
          .filter(v => !isNaN(v))
        
        const origStep = Math.max(1, Math.floor(origValues.length / 12))
        originalData = []
        const origSampledLabels = []
        for (let i = 0; i < origValues.length; i += origStep) {
          originalData.push(origValues[i])
          origSampledLabels.push(originalLabels[i])
        }
        originalLabels = origSampledLabels
      }
    }
    
    let processedData = [...sampledData]
    
    if (enabledStrategies.outlier && !preprocessingResult.value) {
      const mean = processedData.reduce((a, b) => a + b, 0) / processedData.length
      const variance = processedData.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / processedData.length
      const std = Math.sqrt(variance)
      
      processedData = processedData.map(v => {
        if (Math.abs(v - mean) > 3 * std) {
          return mean
        }
        return v
      })
    }
    
    if (enabledStrategies.noise && !preprocessingResult.value) {
      const windowSize = 3
      const smoothed = []
      for (let i = 0; i < processedData.length; i++) {
        const start = Math.max(0, i - windowSize)
        const end = Math.min(processedData.length, i + windowSize + 1)
        const avg = processedData.slice(start, end).reduce((a, b) => a + b, 0) / (end - start)
        smoothed.push(avg)
      }
      processedData = smoothed
    }
    
    const showOriginal = (enabledStrategies.resampling || enabledStrategies.missingValue || enabledStrategies.outlier || enabledStrategies.noise) && originalData
    
    const seriesList = [
      ...(showOriginal ? [{
        name: '原始序列',
        type: 'line',
        data: originalData,
        lineStyle: { color: '#94a3b8', width: 2, type: 'dashed' },
        symbol: 'circle',
        symbolSize: 6
      }] : []),
      {
        name: '处理后序列',
        type: 'line',
        data: processedData,
        smooth: true,
        lineStyle: { color: '#0052cc', width: 3 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0052cc20' },
            { offset: 1, color: '#0052cc05' }
          ])
        }
      }
    ]
    
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: {
        type: 'category',
        data: showOriginal ? originalLabels : sampledLabels,
        axisLabel: { fontSize: 10, rotate: (showOriginal ? originalLabels[0] : sampledLabels[0])?.length > 10 ? 45 : 0 }
      },
      yAxis: { type: 'value' },
      series: seriesList
    })
  }
}

const handleCancel = () => {
  showConfirmDialog.value = true
}

const goHome = () => {
  showConfirmDialog.value = false
  resetState()
  router.push('/dashboard')
}

const resetState = () => {
  projectData.value = null
  hasData.value = false
  progress.value = 0
  progressText.value = '准备就绪'
  localStorage.removeItem('projectData')
  localStorage.removeItem('preprocessingOptions')
  
  if (chart) {
    chart.clear()
  }
}

const confirmCancel = async () => {
  localStorage.setItem('lastPage', '/preprocessing')
  
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId) {
    try {
      await api.patch(`/projects/${projectId}`, { status: 'preprocessing' })
    } catch (error) {
      console.error('更新项目状态失败:', error)
    }
  }
  
  const dataToSave = {
    fileName: projectData.value?.fileName || '未命名项目',
    timeCol: projectData.value?.timeCol || '',
    targetCol: projectData.value?.targetCol || '',
    headers: projectData.value?.headers || [],
    data: projectData.value?.data || [],
    currentStep: 3
  }
  
  const history = JSON.parse(localStorage.getItem('historyRecords') || '[]')
  const newRecord = {
    id: projectId || Date.now(),
    name: dataToSave.fileName || '未命名项目',
    time: new Date().toLocaleString('zh-CN'),
    type: '数据分析',
    status: '进行中',
    data: dataToSave,
    currentStep: 3
  }
  history.unshift(newRecord)
  localStorage.setItem('historyRecords', JSON.stringify(history))
  
  showConfirmDialog.value = false
  resetState()
  router.push('/dashboard')
}

const handleExport = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  
  if (projectId) {
    try {
      const response = await api.get(`/projects/${projectId}/preprocessing/download`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'processed_data.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载失败:', error)
    }
  } else {
    const enabledList = []
    if (enabledStrategies.resampling) enabledList.push(`重采样(${selectedOptions.resampling})`)
    if (enabledStrategies.missingValue) enabledList.push(`缺失值插补(${selectedOptions.missingValue})`)
    if (enabledStrategies.outlier) enabledList.push(`异常值检测(${selectedOptions.outlier})`)
    if (enabledStrategies.noise) enabledList.push(`噪声处理(${selectedOptions.noise})`)
    
    const content = `预处理配置
==========

已启用的策略：
${enabledList.length > 0 ? enabledList.map((item, i) => `${i + 1}. ${item}`).join('\n') : '无'}

配置详情：
- 重采样：${selectedOptions.resampling}
- 缺失值：${selectedOptions.missingValue}
- 异常值检测：${selectedOptions.outlier}
- 异常值处理：${selectedOptions.outlierMethod}
- 噪声处理：${selectedOptions.noise}

数据统计：
- 缺失率：${missingRate.value}%
- 异常值数：${outlierCount.value}
- 数据行数：${dataRowCount.value}`
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '预处理配置.txt'
    a.click()
    URL.revokeObjectURL(url)
  }
}

const handleSaveAndNext = async () => {
  savePreprocessingOptions()
  
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId) {
    try {
      await api.patch(`/projects/${projectId}`, {
        status: 'preprocessing'
      })
    } catch (error) {
      console.error('更新项目状态失败:', error)
    }
  }
  
  router.push('/feature-engineering')
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  loadProjectData()
  
  const savedOptions = localStorage.getItem('preprocessingOptions')
  if (savedOptions) {
    const options = JSON.parse(savedOptions)
    Object.assign(enabledStrategies, options.enabledStrategies)
    Object.assign(selectedOptions, options.selectedOptions)
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>
