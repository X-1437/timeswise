<template>
  <aside 
    class="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col gap-6 transition-all duration-300"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex justify-end mb-2">
      <button 
        @click="toggleCollapse" 
        class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
        :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
      >
        <span class="material-symbols-outlined text-xl transition-transform" :class="collapsed ? 'rotate-180' : ''">
          chevron_left
        </span>
      </button>
    </div>
    
    <div v-if="!collapsed">
      <h3 class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">项目管理</h3>
      <nav class="space-y-1">
        <router-link 
          to="/dashboard" 
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
          :class="$route.path === '/dashboard' ? 'bg-primary/10 text-primary font-medium' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        >
          <span class="material-symbols-outlined">dashboard</span>
          <span>项目概览</span>
        </router-link>
        <div class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" @click="navigateTo('/history')">
          <span class="material-symbols-outlined">history</span>
          <span>历史记录</span>
        </div>
      </nav>
    </div>
    
    <div v-if="collapsed" class="flex flex-col items-center gap-2">
      <router-link 
        to="/dashboard" 
        class="p-2 rounded-lg transition-colors"
        :class="$route.path === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
        :title="'项目概览'"
      >
        <span class="material-symbols-outlined">dashboard</span>
      </router-link>
      <div 
        class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        @click="navigateTo('/history')"
        title="历史记录"
      >
        <span class="material-symbols-outlined">history</span>
      </div>
    </div>
    
    <div v-if="!collapsed">
      <h3 class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">分析流程</h3>
      <div class="space-y-4 px-3">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex items-start gap-3 cursor-pointer group"
          @click="navigateTo(step.path)"
        >
          <div class="flex flex-col items-center gap-1">
            <div 
              class="size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
              :class="getStepClass(index + 1)"
            >
              <span v-if="currentStep > index + 1" class="material-symbols-outlined text-[12px]">check</span>
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div v-if="index < steps.length - 1" class="w-0.5 h-6 bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <span 
            class="text-sm transition-colors"
            :class="currentStep === index + 1 ? 'font-medium text-primary' : 'text-slate-500 group-hover:text-primary'"
          >
            {{ step.name }}
          </span>
        </div>
      </div>
    </div>
    
    <div v-if="collapsed" class="flex flex-col items-center gap-2 flex-1">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="flex flex-col items-center gap-1 cursor-pointer group"
        @click="navigateTo(step.path)"
      >
        <div 
          class="size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors"
          :class="getStepClass(index + 1)"
          :title="step.name"
        >
          <span v-if="currentStep > index + 1" class="material-symbols-outlined text-[12px]">check</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div v-if="index < steps.length - 1" class="w-0.5 h-4 bg-slate-200 dark:bg-slate-700"></div>
      </div>
    </div>
    
    <div class="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
      <div v-if="!collapsed" class="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer" @click="navigateTo('/profile')">
        <span class="material-symbols-outlined text-xl">settings</span>
        <span>设置</span>
      </div>
      <div v-if="collapsed" class="flex flex-col items-center">
        <div 
          class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          @click="navigateTo('/profile')"
          title="设置"
        >
          <span class="material-symbols-outlined">settings</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 0
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle-collapse'])

const router = useRouter()

const steps = [
  { name: '数据接入', path: '/data-import' },
  { name: 'EDA', path: '/eda' },
  { name: '预处理', path: '/preprocessing' },
  { name: '特征工程', path: '/feature-engineering' },
  { name: '朴素预测', path: '/forecasting' },
  { name: '报告导出', path: '/export' }
]

const getStepClass = (step) => {
  if (props.currentStep > step) {
    return 'bg-green-500 text-white'
  } else if (props.currentStep === step) {
    return 'bg-primary text-white'
  } else {
    return 'border-2 border-slate-200 dark:border-slate-700 text-slate-400'
  }
}

const navigateTo = (path) => {
  router.push(path)
}

const toggleCollapse = () => {
  emit('toggle-collapse')
}
</script>
