<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <span class="cursor-pointer hover:text-primary" @click="$router.push('/dashboard')">项目主页</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-slate-900 dark:text-slate-100 font-medium">特征工程</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">特征工程</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">通过时域和频域特征提取，增强时间序列数据的表达能力以提高预测精度。</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">settings_suggest</span>
                <h2 class="text-lg font-bold">特征提取相关配置</h2>
              </div>
              
              <div class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                <div>
                  <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">schedule</span>
                    时域特征
                  </h3>
                  
                  <div class="space-y-3 pl-2">
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
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
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
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
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
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
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
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
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
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
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
                
                <div>
                  <h3 class="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-base">wave</span>
                    频域特征
                  </h3>
                  
                  <div class="space-y-3 pl-2">
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" v-model="enabledFreqFeatures.fft" class="w-4 h-4 text-primary rounded border-slate-300" />
                        <span class="text-sm font-medium">傅里叶变换 (FFT)</span>
                      </div>
                      <p class="text-xs text-slate-500 mb-2">将时域信号转换为频域，识别主周期</p>
                      <div v-if="enabledFreqFeatures.fft" class="space-y-2">
                        <label class="text-xs text-slate-500 mb-1 block">提取谐波数量</label>
                        <select v-model="selectedFreqOptions.fftHarmonics" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded py-1.5 px-2 text-xs">
                          <option value="3">3个主要频率</option>
                          <option value="5">5个主要频率</option>
                          <option value="10">10个主要频率</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" v-model="enabledFreqFeatures.wavelet" class="w-4 h-4 text-primary rounded border-slate-300" />
                        <span class="text-sm font-medium">小波变换</span>
                      </div>
                      <p class="text-xs text-slate-500 mb-2">多尺度时频分析，适合非平稳信号</p>
                      <div v-if="enabledFreqFeatures.wavelet" class="space-y-2">
                        <label class="text-xs text-slate-500 mb-1 block">小波基函数</label>
                        <select v-model="selectedFreqOptions.waveletType" class="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded py-1.5 px-2 text-xs">
                          <option value="haar">Haar</option>
                          <option value="db4">Daubechies 4</option>
                          <option value="sym4">Symlets 4</option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" v-model="enabledFreqFeatures.psd" class="w-4 h-4 text-primary rounded border-slate-300" />
                        <span class="text-sm font-medium">功率谱密度 (PSD)</span>
                      </div>
                      <p class="text-xs text-slate-500 mb-2">分析信号在不同频率上的功率分布</p>
                    </div>
                    
                    <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div class="flex items-center gap-2 mb-2">
                        <input type="checkbox" v-model="enabledFreqFeatures.spectrogram" class="w-4 h-4 text-primary rounded border-slate-300" />
                        <span class="text-sm font-medium">频谱图</span>
                      </div>
                      <p class="text-xs text-slate-500 mb-2">时频联合分析，展示频率随时间变化</p>
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
          </div>
          
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">analytics</span>
                  <h2 class="text-lg font-bold">特征可视化预览</h2>
                </div>
                <div class="flex gap-2">
                  <button @click="activeChart = 'time'" class="px-3 py-1 text-xs rounded-full transition-colors" :class="activeChart === 'time' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'">
                    时域
                  </button>
                  <button @click="activeChart = 'freq'" class="px-3 py-1 text-xs rounded-full transition-colors" :class="activeChart === 'freq' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'">
                    频域
                  </button>
                </div>
              </div>
              
              <div v-if="!hasData" class="h-[500px] flex items-center justify-center">
                <div class="text-center">
                  <span class="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">upload_file</span>
                  <p class="text-slate-500 dark:text-slate-400">请先完成数据接入和预处理</p>
                </div>
              </div>
              
              <div v-else ref="chartRef" class="h-[500px]"></div>
              
              <div v-if="hasData" class="grid grid-cols-4 gap-3 mt-4">
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">时域特征</p>
                  <p class="text-xl font-bold text-primary">{{ timeFeatureCount }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">频域特征</p>
                  <p class="text-xl font-bold text-primary">{{ freqFeatureCount }}</p>
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
            
            <div class="flex gap-4">
              <button @click="handleExport" class="flex-1 px-6 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                <span class="material-symbols-outlined">download</span>
                <span>导出特征配置</span>
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
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()

const chartRef = ref(null)
let chart = null
const showConfirmDialog = ref(false)
const activeChart = ref('time')
const progress = ref(0)
const progressText = ref('准备就绪')

const projectData = ref(null)
const hasData = ref(false)

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

const enabledFreqFeatures = reactive({
  fft: false,
  wavelet: false,
  psd: false,
  spectrogram: false
})

const selectedFreqOptions = reactive({
  fftHarmonics: '5',
  waveletType: 'db4'
})

const selectedLags = ref([1, 2, 3])

const timeFeatureCount = computed(() => {
  let count = 0
  if (enabledTimeFeatures.trend) count += selectedTimeFeatures.trend.length
  if (enabledTimeFeatures.seasonal) count += selectedTimeFeatures.seasonal.length
  if (enabledTimeFeatures.autocorrelation) count += selectedTimeFeatures.autocorrelation.length
  if (enabledTimeFeatures.lag) count += selectedLags.value.length
  if (enabledTimeFeatures.rolling) count += selectedTimeFeatures.rolling.length
  if (enabledTimeFeatures.differencing) count += selectedTimeFeatures.differencing.length
  return count
})

const freqFeatureCount = computed(() => {
  let count = 0
  if (enabledFreqFeatures.fft) count += parseInt(selectedFreqOptions.fftHarmonics)
  if (enabledFreqFeatures.wavelet) count += 3
  if (enabledFreqFeatures.psd) count += 1
  if (enabledFreqFeatures.spectrogram) count += 1
  return count
})

const totalFeatureCount = computed(() => timeFeatureCount.value + freqFeatureCount.value)

const loadProjectData = () => {
  const savedData = localStorage.getItem('projectData')
  if (savedData) {
    projectData.value = JSON.parse(savedData)
    hasData.value = true
    initChart()
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

const extractFeatures = () => {
  saveFeatureOptions()
  
  progress.value = 0
  progressText.value = '正在提取特征...'
  
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
      const steps = ['时域特征提取', '频域特征提取', '特征融合']
      const stepIndex = Math.floor(currentProgress / 35)
      progressText.value = `正在${steps[Math.min(stepIndex, 2)]}...`
    }
  }, 200)
}

const saveFeatureOptions = () => {
  const options = {
    enabledTimeFeatures: { ...enabledTimeFeatures },
    selectedTimeFeatures: { ...selectedTimeFeatures },
    enabledFreqFeatures: { ...enabledFreqFeatures },
    selectedFreqOptions: { ...selectedFreqOptions },
    selectedLags: [...selectedLags.value]
  }
  localStorage.setItem('featureOptions', JSON.stringify(options))
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
    
    const numericValues = data
      .map(row => parseFloat(row[targetColIndex]))
      .filter(v => !isNaN(v))
    
    const step = Math.max(1, Math.floor(numericValues.length / 20))
    const sampledData = []
    for (let i = 0; i < numericValues.length; i += step) {
      sampledData.push(numericValues[i])
    }
    
    if (activeChart.value === 'time') {
      const trendLine = sampledData.map((v, i) => {
        const slope = (sampledData[sampledData.length - 1] - sampledData[0]) / sampledData.length
        return sampledData[0] + slope * i
      })
      
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: sampledData.map((_, i) => `点${i + 1}`),
          axisLabel: { fontSize: 10 }
        },
        yAxis: { type: 'value' },
        series: [
          {
            name: '原始序列',
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
          },
          {
            name: '趋势线',
            type: 'line',
            data: trendLine,
            lineStyle: { color: '#f97316', width: 2, type: 'dashed' }
          }
        ]
      })
    } else {
      const fftData = sampledData.map((v, i) => ({
        value: Math.abs(Math.sin(i * 0.5) * v),
        itemStyle: { color: i === 2 ? '#ef4444' : i === 5 ? '#f97316' : '#0052cc' }
      }))
      
      chart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: fftData.map((_, i) => `频率${i + 1}`),
          axisLabel: { fontSize: 10 }
        },
        yAxis: { type: 'value', name: '幅值' },
        series: [{
          name: '频谱',
          type: 'bar',
          data: fftData,
          barWidth: '60%'
        }]
      })
    }
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
  localStorage.removeItem('featureOptions')
  
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
    currentStep: 4
  }
  
  const history = JSON.parse(localStorage.getItem('historyRecords') || '[]')
  const newRecord = {
    id: Date.now(),
    name: dataToSave.fileName || '未命名项目',
    time: new Date().toLocaleString('zh-CN'),
    type: '数据分析',
    status: '进行中',
    data: dataToSave,
    currentStep: 4
  }
  history.unshift(newRecord)
  localStorage.setItem('historyRecords', JSON.stringify(history))
  
  showConfirmDialog.value = false
  resetState()
  router.push('/')
}

const handleExport = () => {
  const content = `特征提取配置\n=============\n\n时域特征：\n${enabledTimeFeatures.trend ? `- 趋势: ${selectedTimeFeatures.trend.join(', ')}` : ''}
${enabledTimeFeatures.seasonal ? `- 季节性: ${selectedTimeFeatures.seasonal.join(', ')}` : ''}
${enabledTimeFeatures.autocorrelation ? `- 自相关性: ${selectedTimeFeatures.autocorrelation.join(', ')}` : ''}
${enabledTimeFeatures.lag ? `- 滞后特征: L${selectedLags.value.join(', L')}` : ''}
${enabledTimeFeatures.rolling ? `- 滚动统计: ${selectedTimeFeatures.rolling.join(', ')}` : ''}
${enabledTimeFeatures.differencing ? `- 差分特征: ${selectedTimeFeatures.differencing.join(', ')}` : ''}

频域特征：
${enabledFreqFeatures.fft ? `- FFT (${selectedFreqOptions.fftHarmonics}个谐波)` : ''}
${enabledFreqFeatures.wavelet ? `- 小波变换 (${selectedFreqOptions.waveletType})` : ''}
${enabledFreqFeatures.psd ? '- 功率谱密度' : ''}
${enabledFreqFeatures.spectrogram ? '- 频谱图' : ''}

统计信息：
- 时域特征数: ${timeFeatureCount.value}
- 频域特征数: ${freqFeatureCount.value}
- 总特征数: ${totalFeatureCount.value}`
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '特征提取配置.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const handleSaveAndNext = () => {
  saveFeatureOptions()
  router.push('/forecasting')
}

const handleResize = () => {
  chart?.resize()
}

watch(activeChart, () => {
  if (hasData.value) {
    initChart()
  }
})

onMounted(() => {
  loadProjectData()
  
  const savedOptions = localStorage.getItem('featureOptions')
  if (savedOptions) {
    const options = JSON.parse(savedOptions)
    Object.assign(enabledTimeFeatures, options.enabledTimeFeatures)
    Object.assign(selectedTimeFeatures, options.selectedTimeFeatures)
    Object.assign(enabledFreqFeatures, options.enabledFreqFeatures)
    Object.assign(selectedFreqOptions, options.selectedFreqOptions)
    selectedLags.value = options.selectedLags || [1, 2, 3]
  }
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})

import { watch } from 'vue'
</script>
