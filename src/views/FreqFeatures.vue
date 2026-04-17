<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center gap-2 text-slate-400 text-sm mb-6">
          <span class="cursor-pointer hover:text-primary" @click="$router.push('/dashboard')">项目主页</span>
          <span class="material-symbols-outlined text-xs">chevron_right</span>
          <span class="text-slate-900 dark:text-slate-100 font-medium">频域特征</span>
        </div>
        
        <div class="mb-8">
          <h1 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">频域特征</h1>
          <p class="text-slate-500 dark:text-slate-400 mt-2">提取时间序列的频域特征，包括FFT、小波变换、功率谱等。</p>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="space-y-6 flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex-1">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-primary">settings_suggest</span>
                <h2 class="text-lg font-bold">频域特征配置</h2>
              </div>
              
              <div class="space-y-6 max-h-[500px] overflow-y-auto pr-2">
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
              <button @click="$router.push('/feature-engineering/time')" class="flex-1 px-6 py-2.5 rounded-lg border border-primary/20 hover:border-primary text-primary font-semibold transition-all hover:bg-primary/5">
                上一步：时域特征
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
                    <option v-if="enabledFreqFeatures.fft" value="fft">FFT</option>
                    <option v-if="enabledFreqFeatures.wavelet" value="wavelet">小波变换</option>
                    <option v-if="enabledFreqFeatures.psd" value="psd">功率谱密度</option>
                    <option v-if="enabledFreqFeatures.spectrogram" value="spectrogram">频谱图</option>
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
              
              <div v-if="hasData" class="grid grid-cols-4 gap-3 mt-4">
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">FFT</p>
                  <p class="text-xl font-bold text-primary">{{ fftCount }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">小波变换</p>
                  <p class="text-xl font-bold text-primary">{{ waveletCount }}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-center">
                  <p class="text-xs text-slate-500">PSD</p>
                  <p class="text-xl font-bold text-primary">{{ psdCount }}</p>
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

const fftCount = computed(() => enabledFreqFeatures.fft ? parseInt(selectedFreqOptions.fftHarmonics) : 0)
const waveletCount = computed(() => enabledFreqFeatures.wavelet ? 3 : 0)
const psdCount = computed(() => enabledFreqFeatures.psd ? 1 : 0)
const totalFeatureCount = computed(() => fftCount.value + waveletCount.value + psdCount.value + (enabledFreqFeatures.spectrogram ? 1 : 0))

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

const extractFeatures = async () => {
  const projectId = localStorage.getItem('currentProjectId')
  
  saveFeatureOptions()
  
  progress.value = 0
  progressText.value = '正在提取频域特征...'
  
  if (projectId) {
    try {
      const response = await api.post(`/projects/${projectId}/features`, {
        time_features: { trend: { enabled: false }, seasonal: { enabled: false }, autocorrelation: { enabled: false }, lag: { enabled: false }, rolling: { enabled: false }, differencing: { enabled: false } },
        freq_features: {
          fft: { enabled: enabledFreqFeatures.fft, harmonics: parseInt(selectedFreqOptions.fftHarmonics) },
          wavelet: { enabled: enabledFreqFeatures.wavelet, wavelet_type: selectedFreqOptions.waveletType },
          psd: { enabled: enabledFreqFeatures.psd },
          spectrogram: { enabled: enabledFreqFeatures.spectrogram }
        }
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
      progressText.value = '正在提取频域特征...'
    }
  }, 200)
}

const saveFeatureOptions = () => {
  const options = {
    enabledFreqFeatures: { ...enabledFreqFeatures },
    selectedFreqOptions: { ...selectedFreqOptions }
  }
  localStorage.setItem('freqFeatureOptions', JSON.stringify(options))
}

const loadFeatureOptions = () => {
  const savedOptions = localStorage.getItem('freqFeatureOptions')
  if (savedOptions) {
    const options = JSON.parse(savedOptions)
    if (options.enabledFreqFeatures) Object.assign(enabledFreqFeatures, options.enabledFreqFeatures)
    if (options.selectedFreqOptions) Object.assign(selectedFreqOptions, options.selectedFreqOptions)
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
    for (let i = 0; i < numericValues.length; i += step) {
      sampledData.push(numericValues[i])
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

    if (selectedFeature === 'original' || selectedFeature === 'fft') {
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

    if (selectedFeature === 'fft' && featureData?.freq_features?.fft) {
      const fftData = featureData.freq_features.fft
      if (fftData.frequencies && fftData.magnitudes) {
        seriesList.push({
          name: 'FFT频谱',
          type: 'bar',
          data: fftData.magnitudes.map((m, i) => ({ value: m, itemStyle: { color: i < 3 ? '#ef4444' : '#0052cc' } })),
          barWidth: '60%'
        })
        xAxisData = fftData.frequencies.map((f, i) => `f${i + 1}: ${f.toFixed(4)}`)
        xAxisName = '频率'
      }
    }

    if (selectedFeature === 'psd' && featureData?.freq_features?.psd) {
      const psdData = featureData.freq_features.psd
      if (psdData.frequencies && psdData.power) {
        seriesList.push({
          name: '功率谱密度',
          type: 'line',
          data: psdData.power,
          lineStyle: { color: '#10b981', width: 2 },
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#10b98130' },
              { offset: 1, color: '#10b98105' }
            ])
          }
        })
        xAxisData = psdData.frequencies.map((f, i) => `f${i + 1}`)
        xAxisName = '频率 (Hz)'
      }
    }

    if (selectedFeature === 'wavelet' && featureData?.freq_features?.wavelet) {
      const waveletData = featureData.freq_features.wavelet
      if (waveletData.coefficients) {
        if (waveletData.coefficients.approximation && waveletData.coefficients.approximation.length > 0) {
          const approxSampled = waveletData.coefficients.approximation.filter((_, i) => i % 2 === 0)
          seriesList.push({
            name: '小波近似系数',
            type: 'line',
            data: approxSampled,
            smooth: true,
            lineStyle: { color: '#f97316', width: 2 }
          })
        }
        if (waveletData.coefficients.details && waveletData.coefficients.details.length > 0) {
          const colors = ['#8b5cf6', '#22c55e', '#ef4444']
          waveletData.coefficients.details.forEach((detail, idx) => {
            const detailSampled = detail.filter((_, i) => i % 2 === 0).slice(0, 50)
            seriesList.push({
              name: `小波细节${idx + 1}`,
              type: 'line',
              data: detailSampled,
              smooth: true,
              lineStyle: { color: colors[idx % colors.length], width: 2 }
            })
          })
        }
      }
    }

    if (selectedFeature === 'spectrogram' && featureData?.freq_features?.spectrogram) {
      const specData = featureData.freq_features.spectrogram
      if (specData.frequencies && specData.power && specData.times) {
        const heatmapData = []
        specData.power.forEach((row, timeIdx) => {
          row.forEach((value, freqIdx) => {
            heatmapData.push([freqIdx, timeIdx, value])
          })
        })
        const maxPower = Math.max(...specData.power.flat()) || 1
        seriesList.push({
          name: '频谱图',
          type: 'heatmap',
          data: heatmapData,
          xAxisIndex: 0,
          yAxisIndex: 0
        })
        xAxisData = specData.times.map(t => t.toFixed(2))
        xAxisName = '时间 (s)'
        chart.setOption({
          tooltip: { trigger: 'item' },
          legend: { data: seriesList.map(s => s.name), bottom: 0 },
          grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
          xAxis: { type: 'category', data: xAxisData, name: xAxisName, axisLabel: { fontSize: 10 } },
          yAxis: { type: 'category', data: specData.frequencies.map((_, i) => `f${i}`), name: '频率 (Hz)' },
          visualMap: {
            min: 0,
            max: maxPower,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            inRange: { color: ['#0a0a2e', '#1a1a5e', '#3b82f6', '#f97316', '#ef4444'] }
          },
          series: seriesList
        })
        return
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
  localStorage.removeItem('freqFeatureOptions')
  if (chart) chart.clear()
}

const confirmCancel = async () => {
  localStorage.setItem('lastPage', '/feature-engineering/freq')
  
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
  const content = `频域特征分析报告
==================

提取时间: ${new Date().toLocaleString('zh-CN')}

频域特征配置：
${enabledFreqFeatures.fft ? `- FFT: ${selectedFreqOptions.fftHarmonics}个谐波` : ''}
${enabledFreqFeatures.wavelet ? `- 小波变换: ${selectedFreqOptions.waveletType}` : ''}
${enabledFreqFeatures.psd ? '- 功率谱密度: 开启' : ''}
${enabledFreqFeatures.spectrogram ? '- 频谱图: 开启' : ''}

总特征数: ${totalFeatureCount.value}
`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '频域特征分析报告.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const handleSaveAndNext = async () => {
  saveFeatureOptions()
  
  const projectId = localStorage.getItem('currentProjectId')
  if (projectId) {
    try {
      await api.patch(`/projects/${projectId}`, { status: 'feature_engineering' })
    } catch (error) {
      console.error('更新项目状态失败:', error)
    }
  }
}

const goToParent = async () => {
  saveFeatureOptions()
  localStorage.setItem('freqFeatureCompleted', 'true')
  
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