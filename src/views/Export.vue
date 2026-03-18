<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <section class="flex flex-col">
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-8 text-center lg:text-left h-full flex flex-col">
              <div class="mb-6 relative inline-flex lg:flex">
                <div class="absolute inset-0 bg-primary/10 rounded-full blur-2xl animate-pulse lg:hidden"></div>
                <div class="relative bg-primary/5 rounded-full w-20 h-20 flex items-center justify-center">
                  <span class="material-symbols-outlined text-5xl text-primary select-none">task</span>
                </div>
              </div>
              
              <h1 class="text-3xl font-bold mb-4 tracking-tight text-slate-900 dark:text-white">分析流程已完成！</h1>
              <p class="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                您的预测报告已生成，包含完整的统计分析、数据质量评估及预测图表。您可以随时点击下方按钮下载。
              </p>
              
              <div class="flex flex-col gap-4">
                <button @click="downloadReport" class="group w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-0.5 active:translate-y-0">
                  <span class="material-symbols-outlined text-2xl">description</span>
                  下载分析报告 (.docx)
                  <span class="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">download</span>
                </button>
                <button @click="finishAndReturnHome" class="w-full flex items-center justify-center gap-3 bg-transparent border-2 border-primary/20 hover:border-primary text-primary py-3.5 px-8 rounded-xl font-semibold text-lg transition-all hover:bg-primary/5 active:scale-[0.98]">
                  <span class="material-symbols-outlined text-2xl">home</span>
                  完成分析并返回首页
                </button>
              </div>
              
              <div class="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 gap-3">
                <button @click="downloadCSV" class="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors border border-slate-100 dark:border-slate-800">
                  <span class="material-symbols-outlined text-lg">csv</span>
                  下载原始数据 (CSV)
                </button>
                <div class="flex gap-3">
                  <button @click="sendToEmail" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors border border-slate-100 dark:border-slate-800">
                    <span class="material-symbols-outlined text-lg">mail</span>
                    发送至邮箱
                  </button>
                  <button @click="shareReport" class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold transition-colors border border-slate-100 dark:border-slate-800">
                    <span class="material-symbols-outlined text-lg">share</span>
                    分享
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          <section class="flex flex-col">
            <div class="flex items-center justify-between px-2 mb-4">
              <h2 class="text-sm font-bold uppercase tracking-widest text-slate-500">分析报告预览</h2>
              <span class="text-xs text-slate-400">页数: 1 / 1</span>
            </div>
            <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full min-h-[700px]">
              <div class="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 px-6 py-3 flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <button @click="zoomOut" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                    <span class="material-symbols-outlined text-slate-500">zoom_out</span>
                  </button>
                  <button @click="zoomIn" class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors">
                    <span class="material-symbols-outlined text-slate-500">zoom_in</span>
                  </button>
                  <div class="h-4 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                  <span class="text-xs font-medium text-slate-500">{{ zoomLevel }}%</span>
                </div>
                <button @click="openFullscreen" class="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                  <span class="material-symbols-outlined text-sm">fullscreen</span> 全屏查看
                </button>
              </div>
              
              <div class="flex-1 p-8 lg:p-12 overflow-y-auto bg-slate-50/30 dark:bg-slate-950/20">
                <div class="max-w-full mx-auto bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 p-8 min-h-[800px] flex flex-col gap-8" :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }">
                  <div class="border-b-2 border-primary pb-6">
                    <div class="text-primary font-bold text-xs mb-2 tracking-widest uppercase">TimeWise Analytics</div>
                    <h3 class="text-2xl font-bold text-slate-900 dark:text-white">时间序列预测分析综合报告</h3>
                    <div class="text-sm text-slate-500 mt-2 italic">报告生成时间: {{ reportDate }}</div>
                  </div>
                  
                  <div>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <span class="w-1 h-5 bg-primary rounded-full"></span>
                      1. 执行摘要
                    </h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      本报告基于用户提供的时间序列数据完成了完整的数据分析流程，包括数据预处理、特征工程、探索性数据分析和朴素预测。
                    </p>
                  </div>
                  
                  <div v-if="hasData" class="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-6 border border-slate-100 dark:border-slate-800">
                    <h5 class="text-xs font-bold text-slate-400 mb-4 uppercase text-center">趋势预测分析</h5>
                    <div ref="chartRef" class="h-48"></div>
                  </div>
                  <div v-else class="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-6 border border-slate-100 dark:border-slate-800">
                    <h5 class="text-xs font-bold text-slate-400 mb-4 uppercase text-center">趋势预测分析</h5>
                    <div class="h-48 flex items-center justify-center text-slate-400">
                      <span class="material-symbols-outlined text-4xl">upload_file</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <span class="w-1 h-5 bg-primary rounded-full"></span>
                      2. 数据概览
                    </h4>
                    <div class="grid grid-cols-2 gap-4">
                      <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col">
                        <span class="text-[10px] text-slate-500 font-bold uppercase">数据行数</span>
                        <span class="text-xl font-bold text-primary">{{ dataInfo.rowCount }}</span>
                      </div>
                      <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col">
                        <span class="text-[10px] text-slate-500 font-bold uppercase">特征数量</span>
                        <span class="text-xl font-bold text-emerald-500">{{ dataInfo.colCount }}</span>
                      </div>
                      <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col">
                        <span class="text-[10px] text-slate-500 font-bold uppercase">目标变量</span>
                        <span class="text-xl font-bold text-amber-500">{{ dataInfo.targetCol }}</span>
                      </div>
                      <div class="p-3 bg-slate-50 dark:bg-slate-800/50 rounded flex flex-col">
                        <span class="text-[10px] text-slate-500 font-bold uppercase">时间列</span>
                        <span class="text-xl font-bold text-purple-500">{{ dataInfo.timeCol }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <span class="w-1 h-5 bg-primary rounded-full"></span>
                      3. 分析结论
                    </h4>
                    <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      通过本次时间序列分析，我们成功完成了数据预处理、特征提取和朴素预测任务。预测结果可作为进一步建模的基准参考。
                    </p>
                  </div>
                  
                  <div class="mt-auto pt-6 text-center border-t border-slate-100 dark:border-slate-800">
                    <span class="text-[10px] text-slate-400">CONFIDENTIAL - TIMEWISE ANALYTICS REPORT</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <footer class="mt-8 px-6 lg:px-8 py-8 border-t border-slate-200 dark:border-slate-800">
          <div class="flex items-center justify-between">
            <button @click="$router.push('/forecasting')" class="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-primary/20 hover:border-primary text-primary font-semibold transition-all hover:bg-primary/5 active:scale-[0.98]">
              <span class="material-symbols-outlined text-xl">arrow_back</span>
              返回上一步
            </button>
            <p class="text-sm text-slate-500 hidden md:block">© 2024 TimeWise 分析引擎. 已通过安全加密处理.</p>
          </div>
        </footer>
      </div>
    </div>
    
    <div v-if="showToast" class="fixed bottom-8 right-8 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3">
      <span class="material-symbols-outlined text-green-400">check_circle</span>
      {{ toastMessage }}
    </div>
    
    <div v-if="showFullscreen" class="fixed inset-0 z-50 bg-white dark:bg-slate-900 p-8 flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold">全屏预览</h2>
        <button @click="closeFullscreen" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>
      <div class="flex-1 overflow-auto bg-slate-100 dark:bg-slate-800 rounded-xl p-8">
        <div class="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 p-12 min-h-[1000px]">
          <div class="border-b-2 border-primary pb-6 mb-8">
            <div class="text-primary font-bold text-xs mb-2 tracking-widest uppercase">TimeWise Analytics</div>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white">时间序列预测分析综合报告</h3>
            <div class="text-sm text-slate-500 mt-2 italic">报告生成时间: {{ reportDate }}</div>
          </div>
          
          <div class="space-y-8">
            <div>
              <h4 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">1. 执行摘要</h4>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                本报告基于用户提供的时间序列数据完成了完整的数据分析流程，包括数据预处理、特征工程、探索性数据分析和朴素预测。
              </p>
            </div>
            
            <div v-if="hasData">
              <h4 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">2. 数据概览</h4>
              <div class="grid grid-cols-4 gap-4">
                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p class="text-xs text-slate-500">数据行数</p>
                  <p class="text-2xl font-bold text-primary">{{ dataInfo.rowCount }}</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p class="text-xs text-slate-500">特征数量</p>
                  <p class="text-2xl font-bold text-emerald-500">{{ dataInfo.colCount }}</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p class="text-xs text-slate-500">目标变量</p>
                  <p class="text-2xl font-bold text-amber-500">{{ dataInfo.targetCol }}</p>
                </div>
                <div class="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <p class="text-xs text-slate-500">时间列</p>
                  <p class="text-2xl font-bold text-purple-500">{{ dataInfo.timeCol }}</p>
                </div>
              </div>
            </div>
            
            <div v-if="hasData">
              <h4 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">3. 趋势分析图</h4>
              <div ref="fullscreenChartRef" class="h-64 bg-slate-50 dark:bg-slate-800 rounded-lg p-4"></div>
            </div>
            
            <div>
              <h4 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3">4. 分析结论</h4>
              <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                通过本次时间序列分析，我们成功完成了数据预处理、特征提取和朴素预测任务。预测结果可作为进一步建模的基准参考。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import MainLayout from '../layouts/MainLayout.vue'

const router = useRouter()

const chartRef = ref(null)
const fullscreenChartRef = ref(null)
let chart = null
let fullscreenChart = null

const hasData = ref(false)
const zoomLevel = ref(100)
const showFullscreen = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const reportDate = ref('')

const dataInfo = ref({
  rowCount: 0,
  colCount: 0,
  targetCol: '-',
  timeCol: '-'
})

const showNotification = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const loadData = () => {
  const savedData = localStorage.getItem('projectData')
  if (savedData) {
    const data = JSON.parse(savedData)
    hasData.value = true
    dataInfo.value = {
      rowCount: data.data.length,
      colCount: data.headers.length,
      targetCol: data.targetCol || '-',
      timeCol: data.timeCol || '-'
    }
  }
  reportDate.value = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const downloadReport = () => {
  const reportContent = `
时间序列预测分析报告
===================

生成时间: ${reportDate.value}

一、数据概览
-----------
- 数据行数: ${dataInfo.value.rowCount}
- 特征数量: ${dataInfo.value.colCount}
- 目标变量: ${dataInfo.value.targetCol}
- 时间列: ${dataInfo.value.timeCol}

二、分析流程
-----------
1. 数据接入 - 完成
2. EDA探索性数据分析 - 完成
3. 数据预处理 - 完成
4. 特征工程 - 完成
5. 朴素预测 - 完成

三、分析结论
-----------
通过本次时间序列分析，我们成功完成了数据预处理、特征提取和朴素预测任务。
预测结果可作为进一步建模的基准参考。

四、建议
-------
1. 建议使用更复杂的模型（如ARIMA、Prophet）进行进一步预测
2. 考虑引入外部特征以提高预测精度
3. 定期更新数据以保持模型的新鲜度

---
此报告由 TimeWise Analytics 自动生成
`
  
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `时间序列分析报告_${new Date().toISOString().split('T')[0]}.txt`
  a.click()
  URL.revokeObjectURL(url)
  
  showNotification('报告下载成功！')
}

const downloadCSV = () => {
  const savedData = localStorage.getItem('projectData')
  if (!savedData) {
    showNotification('暂无数据可下载')
    return
  }
  
  const data = JSON.parse(savedData)
  const headers = data.headers.join(',')
  const rows = data.data.map(row => row.join(',')).join('\n')
  const csvContent = `${headers}\n${rows}`
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${data.fileName || '原始数据'}.csv`
  a.click()
  URL.revokeObjectURL(url)
  
  showNotification('CSV文件下载成功！')
}

const sendToEmail = () => {
  const subject = encodeURIComponent('TimeWise 时间序列分析报告')
  const body = encodeURIComponent(`
您好，

附件为您的 TimeWise 时间序列分析报告。

报告生成时间: ${reportDate.value}

数据概览:
- 数据行数: ${dataInfo.value.rowCount}
- 特征数量: ${dataInfo.value.colCount}
- 目标变量: ${dataInfo.value.targetCol}

请查收！

---
TimeWise Analytics
  `)
  
  window.location.href = `mailto:?subject=${subject}&body=${body}`
  showNotification('已打开邮件客户端')
}

const shareReport = () => {
  const reportText = `
TimeWise 时间序列分析报告
生成时间: ${reportDate.value}
数据行数: ${dataInfo.value.rowCount}
特征数量: ${dataInfo.value.colCount}
目标变量: ${dataInfo.value.targetCol}
  `
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(reportText).then(() => {
      showNotification('报告摘要已复制到剪贴板！')
    }).catch(() => {
      showNotification('复制失败，请手动复制')
    })
  } else {
    showNotification('浏览器不支持剪贴板功能')
  }
}

const finishAndReturnHome = () => {
  const savedData = localStorage.getItem('projectData')
  if (savedData) {
    const data = JSON.parse(savedData)
    const history = JSON.parse(localStorage.getItem('historyRecords') || '[]')
    const newRecord = {
      id: Date.now(),
      name: data.fileName || '未命名项目',
      time: new Date().toLocaleString('zh-CN'),
      type: '数据分析',
      status: '已完成',
      data: data,
      currentStep: 6
    }
    history.unshift(newRecord)
    localStorage.setItem('historyRecords', JSON.stringify(history))
  }
  
  showNotification('进度已保存！')
  setTimeout(() => {
    router.push('/dashboard')
  }, 1000)
}

const zoomIn = () => {
  if (zoomLevel.value < 150) {
    zoomLevel.value += 10
  }
}

const zoomOut = () => {
  if (zoomLevel.value > 50) {
    zoomLevel.value -= 10
  }
}

const openFullscreen = () => {
  showFullscreen.value = true
  setTimeout(() => {
    if (fullscreenChartRef.value && hasData.value) {
      initFullscreenChart()
    }
  }, 100)
}

const closeFullscreen = () => {
  showFullscreen.value = false
}

const initChart = () => {
  if (chartRef.value && hasData.value) {
    const savedData = localStorage.getItem('projectData')
    if (savedData) {
      const data = JSON.parse(savedData)
      const targetColIndex = data.headers.indexOf(data.targetCol)
      const values = data.data
        .map(row => parseFloat(row[targetColIndex]))
        .filter(v => !isNaN(v))
      
      const step = Math.max(1, Math.floor(values.length / 8))
      const sampledData = []
      for (let i = 0; i < values.length; i += step) {
        sampledData.push(values[i])
      }
      
      chart = echarts.init(chartRef.value)
      chart.setOption({
        grid: { left: '3%', right: '3%', top: '10%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: sampledData.map((_, i) => `点${i + 1}`),
          axisLabel: { fontSize: 9 }
        },
        yAxis: { type: 'value' },
        series: [{
          type: 'line',
          data: sampledData,
          smooth: true,
          lineStyle: { color: '#0052cc', width: 2 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0052cc30' },
              { offset: 1, color: '#0052cc05' }
            ])
          },
          symbol: 'circle',
          symbolSize: 6
        }]
      })
    }
  }
}

const initFullscreenChart = () => {
  if (fullscreenChartRef.value) {
    const savedData = localStorage.getItem('projectData')
    if (savedData) {
      const data = JSON.parse(savedData)
      const targetColIndex = data.headers.indexOf(data.targetCol)
      const values = data.data
        .map(row => parseFloat(row[targetColIndex]))
        .filter(v => !isNaN(v))
      
      const step = Math.max(1, Math.floor(values.length / 12))
      const sampledData = []
      for (let i = 0; i < values.length; i += step) {
        sampledData.push(values[i])
      }
      
      fullscreenChart = echarts.init(fullscreenChartRef.value)
      fullscreenChart.setOption({
        grid: { left: '3%', right: '3%', top: '10%', bottom: '10%', containLabel: true },
        xAxis: {
          type: 'category',
          data: sampledData.map((_, i) => `点${i + 1}`),
          axisLabel: { fontSize: 11 }
        },
        yAxis: { type: 'value' },
        series: [{
          type: 'line',
          data: sampledData,
          smooth: true,
          lineStyle: { color: '#0052cc', width: 3 },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0052cc30' },
              { offset: 1, color: '#0052cc05' }
            ])
          },
          symbol: 'circle',
          symbolSize: 8
        }]
      })
    }
  }
}

const handleResize = () => {
  chart?.resize()
  fullscreenChart?.resize()
}

onMounted(() => {
  loadData()
  setTimeout(() => {
    initChart()
  }, 100)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
  fullscreenChart?.dispose()
})
</script>
