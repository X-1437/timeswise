<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <span class="cursor-pointer hover:text-primary" @click="$router.push('/dashboard')">项目主页</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-slate-900 dark:text-slate-100 font-medium">时域特征</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">时域特征</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">提取时间序列的时域特征，包括趋势、季节性、自相关性等。</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">settings_suggest</span>
                <h2 class="text-lg font-bold">时域特征配置</h2>
              </div>
              
              <div class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                <div>
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" v-model="enabledTimeFeatures.trend" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="text-sm font-medium">趋势特征</span>
                    </div>
                    <p class="text-xs text-slate-500 mb-2">提取数据的发展趋势信息</p>
                    <div v-if="enabledTimeFeatures.trend" class="flex flex-wrap gap-2">
                      <label v-for="opt in trendOptions" :key="opt.value" class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="selectedTimeFeatures.trend" :value="opt.value" class="w-3 h-3 text-primary rounded border-slate-300" />
                        <span class="text-xs">{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mt-3">
                    <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" v-model="enabledTimeFeatures.seasonal" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="text-sm font-medium">季节性特征</span>
                    </div>
                    <p class="text-xs text-slate-500 mb-2">识别周期性的季节变化模式</p>
                    <div v-if="enabledTimeFeatures.seasonal" class="flex flex-wrap gap-2">
                      <label v-for="opt in seasonalOptions" :key="opt.value" class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="selectedTimeFeatures.seasonal" :value="opt.value" class="w-3 h-3 text-primary rounded border-slate-300" />
                        <span class="text-xs">{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mt-3">
                    <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" v-model="enabledTimeFeatures.autocorrelation" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="text-sm font-medium">自相关性特征</span>
                    </div>
                    <p class="text-xs text-slate-500 mb-2">分析时间序列自身的相关结构</p>
                    <div v-if="enabledTimeFeatures.autocorrelation" class="flex flex-wrap gap-2">
                      <label v-for="opt in autocorrelationOptions" :key="opt.value" class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="selectedTimeFeatures.autocorrelation" :value="opt.value" class="w-3 h-3 text-primary rounded border-slate-300" />
                        <span class="text-xs">{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mt-3">
                    <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" v-model="enabledTimeFeatures.lag" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="text-sm font-medium">滞后特征</span>
                    </div>
                    <p class="text-xs text-slate-500 mb-2">使用历史数据点作为预测特征</p>
                    <div v-if="enabledTimeFeatures.lag" class="mt-2">
                      <label class="text-xs text-slate-500 mb-1 block">选择滞后阶数</label>
                      <div class="flex flex-wrap gap-2">
                        <label v-for="lag in lagOptions" :key="lag" class="flex items-center justify-center px-3 py-1.5 border rounded cursor-pointer text-xs"
                          :class="selectedLags.includes(lag) ? 'bg-primary/10 border-primary text-primary' : 'border-slate-200 dark:border-slate-700'">
                          <input type="checkbox" :checked="selectedLags.includes(lag)" @change="toggleLag(lag)" class="hidden" />
                          L{{ lag }}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mt-3">
                    <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" v-model="enabledTimeFeatures.rolling" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="text-sm font-medium">滚动统计特征</span>
                    </div>
                    <p class="text-xs text-slate-500 mb-2">计算滑动窗口内的统计量</p>
                    <div v-if="enabledTimeFeatures.rolling" class="flex flex-wrap gap-2">
                      <label v-for="opt in rollingOptions" :key="opt.value" class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="selectedTimeFeatures.rolling" :value="opt.value" class="w-3 h-3 text-primary rounded border-slate-300" />
                        <span class="text-xs">{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>
                  
                  <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 mt-3">
                    <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" v-model="enabledTimeFeatures.differencing" class="w-4 h-4 text-primary rounded border-slate-300" />
                      <span class="text-sm font-medium">差分特征</span>
                    </div>
                    <p class="text-xs text-slate-500 mb-2">计算序列的差分以实现平稳化</p>
                    <div v-if="enabledTimeFeatures.differencing" class="flex flex-wrap gap-2">
                      <label v-for="opt in differencingOptions" :key="opt.value" class="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" v-model="selectedTimeFeatures.differencing" :value="opt.value" class="w-3 h-3 text-primary rounded border-slate-300" />
                        <span class="text-xs">{{ opt.label }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="mt-6 space-y-4">
                <button @click="extractFeatures" class="w-full py-3 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                  <span class="material-symbols-outlined">auto_fix_high</span>
                  执行特征提取
                </button>
                
                <div class="space-y-2">
                  <div class="flex justify-between text-xs font-medium">
                    <span>提取进度</span>
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
              <button @click="$router.push('/preprocessing')" class="flex-1 px-6 py-2.5 rounded-lg border border-primary/20 hover:border-primary text-primary font-semibold transition-all hover:bg-primary/5">
                上一步：预处理
              </button>
            </div>
            
              <div class="flex gap-4">
              <button @click="handleExport" class="flex-1 px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">download</span>
                <span>导出分析报告</span>
              </button>
              <button @click="goToParent" class="flex-1 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                下一步
              </button>
            </div>
          </div>
          
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">analytics</span>
                  <h2 class="text-lg font-bold">特征可视化预览</h2>
                </div>
                <div class="flex items-center gap-2">
                  <select v-model="selectedChartFeature" class="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                    <option value="original">原始数据</option>
                    <option v-if="enabledTimeFeatures.trend && selectedTimeFeatures.trend.length > 0" value="trend">趋势特征</option>
                    <option v-if="enabledTimeFeatures.seasonal && selectedTimeFeatures.seasonal.length > 0" value="seasonal">季节性特征</option>
                    <option v-if="enabledTimeFeatures.autocorrelation && selectedTimeFeatures.autocorrelation.length > 0" value="autocorrelation">自相关性</option>
                    <option v-if="enabledTimeFeatures.lag && selectedLags.length > 0" value="lag">滞后特征</option>
                    <option v-if="enabledTimeFeatures.rolling && selectedTimeFeatures.rolling.length > 0" value="rolling">滚动统计</option>
                    <option v-if="enabledTimeFeatures.differencing && selectedTimeFeatures.differencing.length > 0" value="differencing">差分特征</option>
                  </select>
                  <button @click="toggleFullscreen" class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500" title="全屏查看">
                    <span class="material-symbols-outlined">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
                  </button>
                </div>
              </div>
              
              <div v-if="!hasData" :class="isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'" class="flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">upload_file</span>
                  <p class="text-slate-500 dark:text-slate-400">请先完成数据接入和预处理</p>
                </div>
              </div>
              
              <div v-else ref="chartRef" :class="isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'"></div>
              
              <div v-if="hasData" class="grid grid-cols-3 gap-3 mt-4">
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">趋势特征</p>
                  <p class="text-xl font-bold text-primary">{{ timeFeatureCount }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">滞后特征</p>
                  <p class="text-xl font-bold text-primary">{{ selectedLags.length }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">总特征数</p>
                  <p class="text-xl font-bold text-primary">{{ totalFeatureCount }}</p>
                </div>
              </div>
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
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
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
const selectedChartFeature = ref('original')
const isFullscreen = ref(false)

const projectData = ref(null)
const hasData = ref(false)
const featureResult = ref(null)

const trendOptions = [
  { label: '线性趋势', value: 'linear' },
  { label: '多项式趋势', value: 'poly' },
  { label: '移动平均', value: 'ma' }
]

const seasonalOptions = [
  { label: '小时周期', value: 'hourly' },
  { label: '日周期', value: 'daily' },
  { label: '周周期', value: 'weekly' },
  { label: '月周期', value: 'monthly' }
]

const autocorrelationOptions = [
  { label: 'ACF', value: 'acf' },
  { label: 'PACF', value: 'pacf' },
  { label: '偏自相关', value: 'partial' }
]

const lagOptions = [1, 2, 3, 4, 5, 6, 7, 14, 21, 28]

const rollingOptions = [
  { label: '均值', value: 'mean' },
  { label: '标准差', value: 'std' },
  { label: '最大值', value: 'max' },
  { label: '最小值', value: 'min' },
  { label: '中位数', value: 'median' }
]

const differencingOptions = [
  { label: '一阶差分', value: 1 },
  { label: '二阶差分', value: 2 },
  { label: '季节性差分', value: 'seasonal' }
]

const enabledTimeFeatures = reactive({
  trend: true,
  seasonal: false,
  autocorrelation: false,
  lag: true,
  rolling: false,
  differencing: false
})

const selectedTimeFeatures = reactive({
  trend: ['linear'],
  seasonal: [],
  autocorrelation: [],
  lag: [],
  rolling: [],
  differencing: []
})

const selectedLags = ref([1, 2, 3])

const totalFeatureCount = computed(() => {
  let count = 0
  if (enabledTimeFeatures.trend) count += selectedTimeFeatures.trend.length
  if (enabledTimeFeatures.seasonal) count += selectedTimeFeatures.seasonal.length
  if (enabledTimeFeatures.autocorrelation) count += selectedTimeFeatures.autocorrelation.length
  if (enabledTimeFeatures.lag) count += selectedLags.value.length
  if (enabledTimeFeatures.rolling) count += selectedTimeFeatures.rolling.length
  if (enabledTimeFeatures.differencing) count += selectedTimeFeatures.differencing.length
  return count
})

const timeFeatureCount = computed(() => {
  let count = 0
  if (enabledTimeFeatures.trend) count += selectedTimeFeatures.trend.length
  if (enabledTimeFeatures.seasonal) count += selectedTimeFeatures.seasonal.length
  if (enabledTimeFeatures.autocorrelation) count += selectedTimeFeatures.autocorrelation.length
  if (enabledTimeFeatures.differencing) count += selectedTimeFeatures.differencing.length
  return count
})

const loadProjectData = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  if (!projectId) {
    const savedData = localStorage.getItem('projectData')
    if (savedData) {
      projectData.value = JSON.parse(savedData)
      hasData.value = true
      initChart()
    }
    return
  }

  loading.value = true
  try {
    const response = await api.get(`/projects/${projectId}`)
    projectData.value = {
      data: response.data.preview || [],
      headers: response.data.columns?.map(c => c.name) || [],
      targetCol: response.data.data_config?.target_column || '',
      timeCol: response.data.data_config?.time_column || ''
    }
    hasData.value = true
    initChart()
  } catch (error) {
    console.error('获取项目数据失败:', error)
    const savedData = localStorage.getItem('projectData')
    if (savedData) {
      projectData.value = JSON.parse(savedData)
      hasData.value = true
      initChart()
    }
  } finally {
    loading.value = false
  }
}

const toggleLag = (lag) => {
  const index = selectedLags.value.indexOf(lag)
  if (index > -1) {
    selectedLags.value.splice(index, 1)
  } else {
    selectedLags.value.push(lag)
  }
}

const extractFeatures = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  
  saveFeatureOptions()
  
  progress.value = 0
  progressText.value = '正在提取时域特征...'
  
  if (projectId) {
    try {
      const response = await api.post(`/projects/${projectId}/features`, {
        time_features: {
          trend: { enabled: enabledTimeFeatures.trend, methods: selectedTimeFeatures.trend },
          seasonal: { enabled: enabledTimeFeatures.seasonal, periods: selectedTimeFeatures.seasonal },
          autocorrelation: { enabled: enabledTimeFeatures.autocorrelation, methods: selectedTimeFeatures.autocorrelation },
          lag: { enabled: enabledTimeFeatures.lag, lags: selectedLags.value },
          rolling: { enabled: enabledTimeFeatures.rolling, stats: selectedTimeFeatures.rolling },
          differencing: { enabled: enabledTimeFeatures.differencing, orders: selectedTimeFeatures.differencing }
        },
        freq_features: { fft: { enabled: false }, wavelet: { enabled: false }, psd: { enabled: false }, spectrogram: { enabled: false } }
      })
      
      featureResult.value = response.data
      progress.value = 100
      progressText.value = '特征提取完成！'
      initChart(response.data)
    } catch (error) {
      console.error('特征提取失败:', error)
      simulateProgress()
    }
  } else {
    simulateProgress()
  }
}

const simulateProgress = () => {
  let currentProgress = 0
  const interval = setInterval(() => {
    currentProgress += 15
    if (currentProgress >= 100) {
      progress.value = 100
      progressText.value = '特征提取完成！'
      clearInterval(interval)
      initChart()
    } else {
      progress.value = currentProgress
      progressText.value = '正在提取时域特征...'
    }
  }, 200)
}

const saveFeatureOptions = () => {
  const options = {
    enabledTimeFeatures: { ...enabledTimeFeatures },
    selectedTimeFeatures: { ...selectedTimeFeatures },
    selectedLags: [...selectedLags.value]
  }
  localStorage.setItem('timeFeatureOptions', JSON.stringify(options))
}

const loadFeatureOptions = () => {
  const savedOptions = localStorage.getItem('timeFeatureOptions')
  if (savedOptions) {
    const options = JSON.parse(savedOptions)
    if (options.enabledTimeFeatures) Object.assign(enabledTimeFeatures, options.enabledTimeFeatures)
    if (options.selectedTimeFeatures) Object.assign(selectedTimeFeatures, options.selectedTimeFeatures)
    if (options.selectedLags) selectedLags.value = options.selectedLags
  }
}

const initChart = (featureData = null) => {
  if (chartRef.value && projectData.value) {
    if (!projectData.value.data || projectData.value.data.length === 0) return
    if (chart) chart.dispose()
    chart = echarts.init(chartRef.value)

    const headers = projectData.value.headers
    const data = projectData.value.data
    const targetCol = projectData.value.targetCol
    const timeCol = projectData.value.timeCol
    let targetColIndex = headers.indexOf(targetCol)

    if (targetColIndex === -1) {
      for (let i = 0; i < headers.length; i++) {
        if (data.some(row => !isNaN(parseFloat(row[i])))) {
          targetColIndex = i
          break
        }
      }
    }
    if (targetColIndex === -1) return

    const numericValues = data.map(row => parseFloat(row[targetColIndex])).filter(v => !isNaN(v))
    const step = Math.max(1, Math.floor(numericValues.length / 50))
    const sampledData = []
    const sampledIndices = []
    for (let i = 0; i < numericValues.length; i += step) {
      sampledData.push(numericValues[i])
      sampledIndices.push(i)
    }

    let xAxisData
    let xAxisName = '数据点序号'
    
    if (timeCol && headers.includes(timeCol)) {
      const timeColIndex = headers.indexOf(timeCol)
      const timeValues = data.map(row => row[timeColIndex]).filter(t => t)
      if (timeValues.length > 0) {
        const sampledTimeValues = []
        for (let i = 0; i < timeValues.length; i += step) {
          sampledTimeValues.push(timeValues[i])
        }
        xAxisData = sampledTimeValues
        xAxisName = timeCol
      }
    }
    
    if (!xAxisData) {
      xAxisData = sampledData.map((_, i) => i + 1)
    }

    const targetColName = targetCol || '数值'
    const seriesList = []
    const selectedFeature = selectedChartFeature.value

    if (selectedFeature === 'original' || selectedFeature === 'trend') {
      seriesList.push({
        name: '原始数据',
        type: 'line',
        data: sampledData,
        smooth: true,
        lineStyle: { color: '#0052cc', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0052cc30' },
            { offset: 1, color: '#0052cc05' }
          ])
        }
      })
    }

    if (selectedFeature === 'trend' && featureData?.time_features?.trend) {
      const trend = featureData.time_features.trend
      if (trend.linear) {
        const trendLine = sampledData.map((_, i) => trend.linear.intercept + trend.linear.slope * i * step)
        seriesList.push({ name: '线性趋势', type: 'line', data: trendLine, lineStyle: { color: '#f97316', width: 2, type: 'dashed' }, smooth: true })
      }
      if (trend.poly && trend.poly.coefficients) {
        const coeffs = trend.poly.coefficients
        const polyLine = sampledData.map((_, i) => {
          const x = i * step
          return coeffs[0] * x * x + coeffs[1] * x + coeffs[2]
        })
        seriesList.push({ name: '多项式趋势', type: 'line', data: polyLine, lineStyle: { color: '#8b5cf6', width: 2, type: 'dashed' }, smooth: true })
      }
      if (trend.ma && trend.ma.values) {
        const maSampled = []
        for (let i = 0; i < trend.ma.values.length; i += step) {
          maSampled.push(trend.ma.values[i])
        }
        seriesList.push({ name: '移动平均', type: 'line', data: maSampled, lineStyle: { color: '#22c55e', width: 2 }, smooth: true })
      }
    }

    if (selectedFeature === 'seasonal' && featureData?.time_features?.seasonal) {
      const seasonal = featureData.time_features.seasonal
      for (const [periodName, periodData] of Object.entries(seasonal)) {
        if (periodData.values) {
          const seasonalValues = periodData.values.filter(v => v !== undefined && v !== null)
          seriesList.push({
            name: periodName === 'hourly' ? '小时周期' : periodName === 'daily' ? '日周期' : periodName === 'weekly' ? '周周期' : '月周期',
            type: 'line',
            data: seasonalValues.slice(0, sampledData.length),
            smooth: true,
            lineStyle: { color: '#ef4444', width: 2 }
          })
        }
      }
    }

    if (selectedFeature === 'autocorrelation' && featureData?.time_features?.autocorrelation) {
      const autocorr = featureData.time_features.autocorrelation
      if (autocorr.acf) {
        seriesList.push({
          name: 'ACF',
          type: 'bar',
          data: autocorr.acf.slice(1, 21),
          itemStyle: { color: '#3b82f6' }
        })
      }
      if (autocorr.pacf) {
        seriesList.push({
          name: 'PACF',
          type: 'line',
          data: autocorr.pacf.slice(1, 21),
          smooth: true,
          lineStyle: { color: '#f97316', width: 2 }
        })
      }
      xAxisData = autocorr.acf ? autocorr.acf.slice(1, 21).map((_, i) => `Lag ${i + 1}`) : xAxisData
      xAxisName = '滞后阶数'
    }

    if (selectedFeature === 'lag' && featureData?.time_features?.lag) {
      const lagData = featureData.time_features.lag
      const colors = ['#3b82f6', '#f97316', '#8b5cf6', '#22c55e', '#ef4444']
      let colorIndex = 0
      for (const [lagName, lagValues] of Object.entries(lagData)) {
        const lagNum = lagName.replace('lag_', '')
        const sampledLagValues = []
        for (let i = 0; i < lagValues.length; i += step) {
          sampledLagValues.push(lagValues[i])
        }
        seriesList.push({
          name: `L${lagNum}`,
          type: 'line',
          data: sampledLagValues,
          smooth: true,
          lineStyle: { color: colors[colorIndex % colors.length], width: 2 }
        })
        colorIndex++
      }
    }

    if (selectedFeature === 'rolling' && featureData?.time_features?.rolling) {
      const rolling = featureData.time_features.rolling
      const colors = ['#3b82f6', '#f97316', '#8b5cf6', '#22c55e', '#ef4444']
      let colorIndex = 0
      const statLabels = { mean: '均值', std: '标准差', max: '最大值', min: '最小值', median: '中位数' }
      for (const [statName, statData] of Object.entries(rolling)) {
        if (statData.values) {
          const sampledValues = []
          for (let i = 0; i < statData.values.length; i += step) {
            sampledValues.push(statData.values[i])
          }
          seriesList.push({
            name: statLabels[statName] || statName,
            type: 'line',
            data: sampledValues,
            smooth: true,
            lineStyle: { color: colors[colorIndex % colors.length], width: 2 }
          })
          colorIndex++
        }
      }
    }

    if (selectedFeature === 'differencing' && featureData?.time_features?.differencing) {
      const diffData = featureData.time_features.differencing
      const colors = ['#3b82f6', '#f97316', '#8b5cf6']
      let colorIndex = 0
      const diffLabels = { diff_1: '一阶差分', diff_2: '二阶差分', seasonal: '季节性差分' }
      for (const [diffName, diffValues] of Object.entries(diffData)) {
        if (diffValues.values || (Array.isArray(diffValues) && diffValues.length > 0)) {
          const values = diffValues.values || diffValues
          const sampledValues = []
          for (let i = 0; i < values.length; i += step) {
            sampledValues.push(values[i])
          }
          seriesList.push({
            name: diffLabels[diffName] || diffName,
            type: 'line',
            data: sampledValues,
            smooth: true,
            lineStyle: { color: colors[colorIndex % colors.length], width: 2 }
          })
          colorIndex++
        }
      }
    }

    chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: seriesList.map(s => s.name), bottom: 0 },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: { type: 'category', data: xAxisData, name: xAxisName, axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', name: targetColName },
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
  localStorage.removeItem('projectData')
  localStorage.removeItem('timeFeatureOptions')
  if (chart) chart.clear()
}

const confirmCancel = async () => {
  localStorage.setItem('lastPage', '/feature-engineering/time')
  
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId) {
    try {
      await api.patch(`/projects/${projectId}`, { status: 'feature_engineering' })
    } catch (error) {
      console.error('更新项目状态失败:', error)
    }
  }
  
  showConfirmDialog.value = false
  resetState()
  router.push('/dashboard')
}

const handleExport = () => {
  const content = `时域特征分析报告
==================

提取时间: ${new Date().toLocaleString('zh-CN')}

时域特征配置：
${enabledTimeFeatures.trend ? `- 趋势特征: ${selectedTimeFeatures.trend.join(', ')}` : ''}
${enabledTimeFeatures.seasonal ? `- 季节性特征: ${selectedTimeFeatures.seasonal.join(', ')}` : ''}
${enabledTimeFeatures.autocorrelation ? `- 自相关性: ${selectedTimeFeatures.autocorrelation.join(', ')}` : ''}
${enabledTimeFeatures.lag ? `- 滞后特征: L${selectedLags.value.join(', L')}` : ''}
${enabledTimeFeatures.rolling ? `- 滚动统计: ${selectedTimeFeatures.rolling.join(', ')}` : ''}
${enabledTimeFeatures.differencing ? `- 差分特征: ${selectedTimeFeatures.differencing.join(', ')}` : ''}

总特征数: ${totalFeatureCount.value}
`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '时域特征分析报告.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const goToFreqFeatures = () => {
  saveFeatureOptions()
  localStorage.setItem('lastPage', '/feature-engineering/freq')
  router.push('/feature-engineering/freq')
}

const goToParent = async () => {
  saveFeatureOptions()
  localStorage.setItem('timeFeatureCompleted', 'true')
  
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId) {
    try {
      await api.patch(`/projects/${projectId}`, { status: 'feature_engineering' })
    } catch (error) {
      console.error('更新项目状态失败:', error)
    }
  }
  
  router.push('/feature-engineering')
}

const handleResize = () => {
  chart?.resize()
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    chartRef.value?.parentElement?.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
  setTimeout(() => {
    chart?.resize()
  }, 100)
}

watch(() => selectedChartFeature.value, () => {
  if (featureResult.value) {
    initChart(featureResult.value)
  } else {
    initChart()
  }
})

onMounted(() => {
  loadFeatureOptions()
  loadProjectData()
  window.addEventListener('resize', handleResize)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  chart?.dispose()
})
</script>