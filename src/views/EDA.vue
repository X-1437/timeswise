<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-6xl mx-auto space-y-8">
        <div class="flex justify-between items-end">
          <div class="space-y-1">
            <nav class="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-widest">
              <span>项目列表</span>
              <span class="material-symbols-outlined text-[14px]">chevron_right</span>
              <span class="text-primary">数据质量评估</span>
            </nav>
            <h2 class="text-3xl font-bold">EDA（探索性数据分析）</h2>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="metric in metrics" :key="metric.label" class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div class="flex justify-between items-start mb-4">
              <span class="material-symbols-outlined p-2 rounded-lg" :class="metric.iconBg" :style="{ color: metric.iconColor }">{{ metric.icon }}</span>
              <span v-if="metric.trend" class="text-[10px] font-bold px-2 py-0.5 rounded-full" :class="metric.trendClass">{{ metric.trend }}</span>
            </div>
            <div class="text-slate-500 text-sm font-medium">{{ metric.label }}</div>
            <div class="text-2xl font-bold mt-1">{{ metric.value }}</div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div class="flex justify-between items-center mb-6">
              <h4 class="font-bold">数据缺失分布</h4>
              <span class="material-symbols-outlined text-slate-400 cursor-help" title="各维度的缺失值百分比">info</span>
            </div>
            <div ref="missingChartRef" class="h-64"></div>
          </div>
          
          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div class="flex justify-between items-center mb-6">
              <h4 class="font-bold">核心变量趋势</h4>
              <div class="flex gap-2 text-xs">
                <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-primary"></span> 均值</span>
                <span class="flex items-center gap-1"><span class="size-2 rounded-full bg-slate-300"></span> 预测</span>
              </div>
            </div>
            <div ref="trendChartRef" class="h-64"></div>
          </div>
        </div>
        
        <div class="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl p-8">
          <div class="flex items-start gap-4">
            <span class="material-symbols-outlined text-primary text-3xl">lightbulb</span>
            <div class="space-y-3">
              <h4 class="text-lg font-bold text-slate-900 dark:text-slate-100">质量建议</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul class="space-y-2">
                  <li v-for="(suggestion, index) in suggestions.slice(0, 2)" :key="index" class="flex items-start gap-2 text-sm">
                    <span class="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span v-html="suggestion"></span>
                  </li>
                </ul>
                <ul class="space-y-2">
                  <li v-for="(suggestion, index) in suggestions.slice(2)" :key="index" class="flex items-start gap-2 text-sm">
                    <span class="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                    <span v-html="suggestion"></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <footer class="flex gap-4 items-center justify-between">
          <button @click="$router.push('/data-import')" class="flex items-center gap-2 px-6 py-2 border border-primary/30 text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors">
            <span class="material-symbols-outlined text-lg">chevron_left</span>
            上一步：数据接入
          </button>
          <div class="flex gap-4">
            <button @click="handleCancel" class="px-6 py-2 rounded-lg font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
              取消
            </button>
            <button @click="handleExport" class="px-6 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
              <span class="material-symbols-outlined text-sm">download</span>
              导出数据质量报告
            </button>
            <button @click="$router.push('/preprocessing')" class="px-8 py-2 bg-primary text-white rounded-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              下一步：预处理
            </button>
          </div>
        </footer>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import MainLayout from '../layouts/MainLayout.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const router = useRouter()

const missingChartRef = ref(null)
const trendChartRef = ref(null)
let missingChart = null
let trendChart = null
const showConfirmDialog = ref(false)

const projectData = ref(null)
const metrics = ref([])
const suggestions = ref([])

const loadProjectData = () => {
  const savedData = localStorage.getItem('projectData')
  if (savedData) {
    projectData.value = JSON.parse(savedData)
    calculateMetrics()
  }
}

const calculateMetrics = () => {
  if (!projectData.value) return
  
  const data = projectData.value.data
  const headers = projectData.value.headers
  
  const totalRows = data.length
  const duplicateSet = new Set()
  let duplicateCount = 0
  
  data.forEach((row, index) => {
    const rowStr = row.join(',')
    if (duplicateSet.has(rowStr)) {
      duplicateCount++
    } else {
      duplicateSet.add(rowStr)
    }
  })
  
  const missingData = headers.map((header, colIndex) => {
    const missingCount = data.filter(row => {
      const val = row[colIndex]
      return val === '' || val === null || val === undefined || val === 'NA' || val === 'N/A' || val === 'null'
    }).length
    return {
      header,
      missingCount,
      missingRate: totalRows > 0 ? (missingCount / totalRows * 100).toFixed(2) : 0
    }
  })
  
  const targetColIndex = headers.indexOf(projectData.value.targetCol)
  const numericValues = data
    .map(row => parseFloat(row[targetColIndex]))
    .filter(v => !isNaN(v))
  
  const mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
  const variance = numericValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / numericValues.length
  const std = Math.sqrt(variance)
  
  const outlierIndices = []
  numericValues.forEach((val, index) => {
    if (Math.abs(val - mean) > 3 * std) {
      outlierIndices.push(index)
    }
  })
  
  metrics.value = [
    { 
      label: '总行数', 
      value: totalRows.toLocaleString(), 
      icon: 'database', 
      iconBg: 'bg-primary/10', 
      iconColor: '#0052cc', 
      trend: null 
    },
    { 
      label: '缺失率%', 
      value: (missingData.reduce((sum, m) => sum + parseFloat(m.missingRate), 0) / missingData.length).toFixed(2) + '%', 
      icon: 'error', 
      iconBg: 'bg-orange-500/10', 
      iconColor: '#f97316' 
    },
    { 
      label: '异常值数', 
      value: outlierIndices.length, 
      icon: 'warning', 
      iconBg: 'bg-red-500/10', 
      iconColor: '#ef4444' 
    },
    { 
      label: '重复记录', 
      value: duplicateCount, 
      icon: 'content_copy', 
      iconBg: 'bg-purple-500/10', 
      iconColor: '#a855f7' 
    }
  ]
  
  const highMissingCols = missingData.filter(m => parseFloat(m.missingRate) > 5)
  suggestions.value = []
  
  if (highMissingCols.length > 0) {
    suggestions.value.push(`检测到 <b>${highMissingCols[0].header}</b> 字段存在 ${highMissingCols[0].missingRate}% 的缺失值，建议使用 <b>插值法</b> 填补。`)
  }
  
  if (duplicateCount > 0) {
    suggestions.value.push(`发现 <b>${duplicateCount}</b> 条重复记录，建议进行去重处理。`)
  }
  
  if (outlierIndices.length > 0) {
    suggestions.value.push(`发现 <b>${outlierIndices.length}</b> 个异常点，可能影响分析结果，建议检查数据来源。`)
  }
  
  suggestions.value.push(`建议在下一步预处理中进行 <b>数据标准化</b> 和 <b>特征选择</b>。`)
  
  initCharts(missingData, numericValues, headers)
}

const initCharts = (missingData, numericValues, headers) => {
  if (missingChartRef.value) {
    missingChart = echarts.init(missingChartRef.value)
    missingChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: missingData.map(m => m.header),
        axisLabel: { fontSize: 10, rotate: 45 }
      },
      yAxis: { type: 'value', name: '%' },
      series: [{
        name: '缺失率',
        type: 'bar',
        data: missingData.map(m => m.missingRate),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#0052cc' },
            { offset: 1, color: '#0052cc80' }
          ])
        }
      }]
    })
  }

  if (trendChartRef.value && numericValues.length > 0) {
    trendChart = echarts.init(trendChartRef.value)
    const step = Math.max(1, Math.floor(numericValues.length / 12))
    const sampledData = []
    for (let i = 0; i < numericValues.length; i += step) {
      sampledData.push(numericValues[i])
    }
    
    trendChart.setOption({
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        data: sampledData.map((_, i) => `点${i + 1}`),
        axisLabel: { fontSize: 10 }
      },
      yAxis: { type: 'value' },
      series: [{
        name: '目标变量',
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
      }]
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
  metrics.value = []
  suggestions.value = []
  localStorage.removeItem('projectData')
  
  if (missingChart) {
    missingChart.clear()
  }
  if (trendChart) {
    trendChart.clear()
  }
}

const confirmCancel = () => {
  const dataToSave = {
    fileName: projectData.value?.fileName || '未命名项目',
    timeCol: projectData.value?.timeCol || '',
    targetCol: projectData.value?.targetCol || '',
    headers: projectData.value?.headers || [],
    data: projectData.value?.data || [],
    currentStep: 2
  }
  
  const history = JSON.parse(localStorage.getItem('historyRecords') || '[]')
  const newRecord = {
    id: Date.now(),
    name: dataToSave.fileName || '未命名项目',
    time: new Date().toLocaleString('zh-CN'),
    type: '数据分析',
    status: '进行中',
    data: dataToSave,
    currentStep: 2
  }
  history.unshift(newRecord)
  localStorage.setItem('historyRecords', JSON.stringify(history))
  
  showConfirmDialog.value = false
  resetState()
  router.push('/')
}

const handleExport = () => {
  const content = `数据质量报告\n================\n\n总行数: ${metrics.value[0]?.value || 0}\n缺失率: ${metrics.value[1]?.value || '0%'}\n异常值数: ${metrics.value[2]?.value || 0}\n重复记录: ${metrics.value[3]?.value || 0}\n\n建议:\n${suggestions.value.map(s => '- ' + s.replace(/<[^>]*>/g, '')).join('\n')}`
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = '数据质量报告.txt'
  a.click()
  URL.revokeObjectURL(url)
}

const handleResize = () => {
  missingChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  loadProjectData()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  missingChart?.dispose()
  trendChart?.dispose()
})
</script>
