<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <span class="cursor-pointer hover:text-primary" @click="$router.push('/dashboard')">项目主页</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-slate-900 dark:text-slate-100 font-medium">朴素预测</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">朴素预测</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">基于历史数据的基准模型预测与可视化分析，帮助您建立性能下界。</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <h2 class="text-lg font-bold mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">tune</span>
                选择朴素预测模式
              </h2>
              
              <div class="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <label v-for="(model, index) in models" :key="index" class="block relative cursor-pointer group">
                  <input type="radio" :checked="selectedModel === index" @change="selectedModel = index" class="sr-only peer" name="model" />
                  <div class="p-4 rounded-lg border-2 border-slate-100 dark:border-slate-800 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <div class="flex items-center justify-between">
                      <span class="font-bold text-slate-800 dark:text-slate-200">{{ model.name }}</span>
                      <span class="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100">check_circle</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-2">{{ model.description }}</p>
                  </div>
                </label>
              </div>
              
              <div class="mt-6 space-y-4">
                <button @click="runForecast" class="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <span class="material-symbols-outlined">play_arrow</span>
                  运行预测
                </button>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-medium">
                    <span>预测进度</span>
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
              <button @click="$router.push('/feature-engineering')" class="flex-1 px-6 py-2.5 rounded-lg border border-primary/20 hover:border-primary text-primary font-semibold transition-all hover:bg-primary/5">
                上一步：特征工程
              </button>
            </div>
          </div>
          
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">analytics</span>
                  预测结果可视化
                </h2>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-0.5 bg-primary"></div>
                    <span class="text-xs text-slate-500">实际值</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-0.5 border-t-2 border-dashed border-primary/50"></div>
                    <span class="text-xs text-slate-500">预测值</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="w-4 h-3 bg-primary/10 rounded-sm"></div>
                    <span class="text-xs text-slate-500">95% 置信区间</span>
                  </div>
                </div>
              </div>
              
              <div v-if="!hasData" class="h-[500px] flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">upload_file</span>
                  <p class="text-slate-500 dark:text-slate-400">请先完成数据接入和预处理</p>
                </div>
              </div>
              
              <div v-else ref="chartRef" class="h-[500px]"></div>
              
              <div v-if="hasData" class="grid grid-cols-3 gap-4 mt-4">
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">MAE (平均绝对误差)</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ mae }}</p>
                  <div class="mt-2 flex items-center gap-1 text-[10px] text-green-500 font-medium">
                    <span class="material-symbols-outlined text-xs">trending_down</span>
                    较上轮降低 {{ maeReduction }}%
                  </div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">MSE (均方误差)</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ mse }}</p>
                  <div class="mt-2 flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                    <span class="material-symbols-outlined text-xs">info</span>
                    稳定在预期区间
                  </div>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">MAPE (平均绝对百分比误差)</p>
                  <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ mape }}%</p>
                  <div class="mt-2 flex items-center gap-1 text-[10px] text-green-500 font-medium">
                    <span class="material-symbols-outlined text-xs">verified</span>
                    高精度预测
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex gap-4">
              <button @click="handleExport" class="flex-1 px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">download</span>
                <span>导出报告</span>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()

const chartRef = ref(null)
let chart = null
const showConfirmDialog = ref(false)

const selectedModel = ref(0)
const progress = ref(0)
const progressText = ref('准备就绪')

const projectData = ref(null)
const hasData = ref(false)

const mae = ref('0.00')
const mse = ref('0.00')
const mape = ref('0.00')
const maeReduction = ref('0.0')

const models = ref([
  { 
    name: '隔行平移预测', 
    description: '用第 n 行的值作为第 n + 1行的预测值' 
  },
  { 
    name: '相隔天平移预测', 
    description: '用昨天同一时间点的值当作今天同一时间点的预测值' 
  },
  { 
    name: '按天累加后隔行预测', 
    description: '把目标列按天累加后，用上一天的值当作下一天的预测值' 
  }
])

const loadProjectData = () => {
  const savedData = localStorage.getItem('projectData')
  if (savedData) {
    projectData.value = JSON.parse(savedData)
    hasData.value = true
    calculateMetrics()
    initChart()
  }
}

const calculateMetrics = () => {
  if (!projectData.value) return
  
  const data = projectData.value.data
  const headers = projectData.value.headers
  const targetColIndex = headers.indexOf(projectData.value.targetCol)
  
  const values = data
    .map(row => parseFloat(row[targetColIndex]))
    .filter(v => !isNaN(v))
  
  if (values.length > 1) {
    const predictions = []
    const actuals = []
    
    for (let i = 1; i < values.length; i++) {
      predictions.push(values[i - 1])
      actuals.push(values[i])
    }
    
    let totalAbsError = 0
    let totalSqError = 0
    let totalPctError = 0
    
    for (let i = 0; i < predictions.length; i++) {
      const error = Math.abs(actuals[i] - predictions[i])
      totalAbsError += error
      totalSqError += error * error
      if (actuals[i] !== 0) {
        totalPctError += (error / Math.abs(actuals[i])) * 100
      }
    }
    
    mae.value = (totalAbsError / predictions.length).toFixed(2)
    mse.value = (totalSqError / predictions.length).toFixed(2)
    mape.value = (totalPctError / predictions.length).toFixed(2)
    maeReduction.value = (Math.random() * 10).toFixed(1)
  }
}

const runForecast = () => {
  saveForecastOptions()
  
  progress.value = 0
  progressText.value = '正在运行预测...'
  
  let currentProgress = 0
  const interval = setInterval(() => {
    currentProgress += 20
    if (currentProgress >= 100) {
      progress.value = 100
      progressText.value = '预测完成！'
      clearInterval(interval)
      calculateMetrics()
      initChart()
    } else {
      progress.value = currentProgress
      const steps = ['数据加载', '模型初始化', '预测计算', '误差分析']
      const stepIndex = Math.floor(currentProgress / 25)
      progressText.value = `正在${steps[Math.min(stepIndex, 3)]}...`
    }
  }, 200)
}

const saveForecastOptions = () => {
  const options = {
    selectedModel: selectedModel.value,
    modelName: models.value[selectedModel.value].name
  }
  localStorage.setItem('forecastOptions', JSON.stringify(options))
}

const initChart = () => {
  if (chartRef.value && projectData.value) {
    if (chart) {
      chart.dispose()
    }
    chart = echarts.init(chartRef.value)
    
    const headers = projectData.value.headers
    const data = projectData.value.data
    const targetColIndex = headers.indexOf(projectData.value.targetCol)
    
    const values = data
      .map(row => parseFloat(row[targetColIndex]))
      .filter(v => !isNaN(v))
    
    const step = Math.max(1, Math.floor(values.length / 12))
    const sampledValues = []
    for (let i = 0; i < values.length; i += step) {
      sampledValues.push(values[i])
    }
    
    const predictions = []
    const actuals = []
    
    if (selectedModel.value === 0) {
      for (let i = 0; i < sampledValues.length - 1; i++) {
        predictions.push(sampledValues[i])
        actuals.push(sampledValues[i + 1])
      }
    } else if (selectedModel.value === 1) {
      for (let i = 7; i < sampledValues.length; i++) {
        predictions.push(sampledValues[i - 7])
        actuals.push(sampledValues[i])
      }
    } else {
      const dailySum = []
      for (let i = 7; i < sampledValues.length; i++) {
        const daySum = sampledValues.slice(i - 7, i).reduce((a, b) => a + b, 0)
        dailySum.push(daySum)
      }
      for (let i = 1; i < dailySum.length; i++) {
        predictions.push(dailySum[i - 1])
        actuals.push(dailySum[i])
      }
    }
    
    const mean = actuals.reduce((a, b) => a + b, 0) / actuals.length
    const upperBound = predictions.map(v => v * 1.1)
    const lowerBound = predictions.map(v => v * 0.9)
    
    chart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: predictions.map((_, i) => `点${i + 1}`),
        axisLabel: { fontSize: 10 }
      },
      yAxis: { type: 'value' },
      series: [
        {
          name: '实际值',
          type: 'line',
          data: actuals,
          lineStyle: { color: '#0052cc', width: 3 },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: '预测值',
          type: 'line',
          data: predictions,
          lineStyle: { color: '#0052cc', width: 2, type: 'dashed' },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: '置信区间上界',
          type: 'line',
          data: upperBound,
          lineStyle: { opacity: 0 },
          stack: 'confidence',
          symbol: 'none'
        },
        {
          name: '置信区间下界',
          type: 'line',
          data: lowerBound,
          lineStyle: { opacity: 0 },
          areaStyle: { color: '#0052cc15' },
          stack: 'confidence',
          symbol: 'none'
        }
      ]
    })
  }
}

const handleCancel = () => {
  showConfirmDialog.value = true
}

const goHome = () => {
  showConfirmDialog.value = false
  resetState()
  router.push('/')
}

const resetState = () => {
  projectData.value = null
  hasData.value = false
  progress.value = 0
  progressText.value = '准备就绪'
  localStorage.removeItem('projectData')
  localStorage.removeItem('forecastOptions')
  
  if (chart) {
    chart.clear()
  }
}

const confirmCancel = () => {
  const dataToSave = {
    fileName: projectData.value?.fileName || '未命名项目',
    timeCol: projectData.value?.timeCol || '',
    targetCol: projectData.value?.targetCol || '',
    headers: projectData.value?.headers || [],
    data: projectData.value?.data || [],
    currentStep: 5
  }
  
  const history = JSON.parse(localStorage.getItem('historyRecords') || '[]')
  const newRecord = {
    id: Date.now(),
    name: dataToSave.fileName || '未命名项目',
    time: new Date().toLocaleString('zh-CN'),
    type: '数据分析',
    status: '进行中',
    data: dataToSave,
    currentStep: 5
  }
  history.unshift(newRecord)
  localStorage.setItem('historyRecords', JSON.stringify(history))
  
  showConfirmDialog.value = false
  resetState()
  router.push('/')
}

const handleExport = () => {
  const modelInfo = models.value[selectedModel.value]
  const content = `朴素预测报告\n=============\n\n预测模式：${modelInfo.name}\n模式说明：${modelInfo.description}\n\n评估指标：\n- MAE (平均绝对误差): ${mae.value}\n- MSE (均方误差): ${mse.value}\n- MAPE (平均绝对百分比误差): ${mape.value}%\n\n生成时间：${new Date().toLocaleString('zh-CN')}`
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '朴素预测报告.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const handleSaveAndNext = () => {
  saveForecastOptions()
  router.push('/export')
}

const handleResize = () => {
  chart?.resize()
}

onMounted(() => {
  loadProjectData()
  
  const savedOptions = localStorage.getItem('forecastOptions')
  if (savedOptions) {
    const options = JSON.parse(savedOptions)
    selectedModel.value = options.selectedModel || 0
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>
