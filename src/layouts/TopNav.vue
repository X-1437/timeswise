<template>
  <header class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="text-primary">
            <span class="material-symbols-outlined text-3xl">timeline</span>
          </div>
          <h1 class="text-xl font-bold tracking-tight">TimeWise</h1>
        </div>
        
        <nav class="hidden lg:flex items-center gap-4 xl:gap-6">
          <template v-for="(step, index) in steps" :key="index">
            <div 
              class="flex items-center gap-2 text-sm cursor-pointer"
              :class="getStepTextClass(index + 1)"
              @click="navigateTo(step.path)"
            >
              <span 
                class="w-6 h-6 rounded-full flex items-center justify-center text-[10px]"
                :class="getStepCircleClass(index + 1)"
              >
                <span v-if="currentStep > index + 1" class="material-symbols-outlined text-[10px]">check</span>
                <span v-else>{{ index + 1 }}</span>
              </span>
              <span>{{ step.name }}</span>
            </div>
            <div v-if="index < steps.length - 1" class="h-px w-4 bg-slate-200 dark:bg-slate-700"></div>
          </template>
        </nav>
        
        <div class="flex items-center gap-4">
          <span class="hidden md:block text-xs text-slate-500 font-medium">项目: 零售需求预测_2024</span>
          <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-xl">person</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 0
  }
})

const router = useRouter()

const steps = [
  { name: '数据接入', path: '/data-import' },
  { name: 'EDA', path: '/eda' },
  { name: '预处理', path: '/preprocessing' },
  { name: '特征工程', path: '/feature-engineering' },
  { name: '朴素预测', path: '/forecasting' },
  { name: '报告导出', path: '/export' }
]

const getStepCircleClass = (step) => {
  if (props.currentStep > step) {
    return 'bg-green-500 text-white'
  } else if (props.currentStep === step) {
    return 'bg-primary text-white'
  } else {
    return 'border border-slate-300 dark:border-slate-600'
  }
}

const getStepTextClass = (step) => {
  if (props.currentStep >= step) {
    return props.currentStep === step ? 'font-semibold text-primary' : 'font-medium text-green-600 dark:text-green-500'
  }
  return 'font-medium text-slate-400'
}

const navigateTo = (path) => {
  router.push(path)
}
</script>
