<template>
  <!-- 未登录 - 公共首页 -->
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <header class="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-6 py-3 sticky top-0 z-50">
      <div class="flex items-center gap-4">
        <div class="text-primary flex items-center">
          <span class="material-symbols-outlined text-3xl">query_stats</span>
        </div>
        <h2 class="text-xl font-bold tracking-tight text-primary">TimeWise</h2>
      </div>
      <div class="flex items-center gap-4">
        <button @click="goToLogin" class="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium text-sm hover:text-primary transition-colors">
          登录
        </button>
        <button @click="goToRegister" class="px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors">
          注册
        </button>
      </div>
    </header>
    
    <main class="flex-1 flex items-center justify-center p-8">
      <div class="max-w-4xl mx-auto text-center">
        <div class="mb-8">
          <h1 class="text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            TimeWise
          </h1>
          <p class="text-xl text-slate-600 dark:text-slate-400">
            智能时间序列数据分析平台
          </p>
        </div>
        
        <div class="grid md:grid-cols-3 gap-6 mt-16">
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div class="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-primary text-2xl">upload_file</span>
            </div>
            <h3 class="font-bold mb-2">数据接入</h3>
            <p class="text-sm text-slate-500">支持 CSV、Excel 格式，最大 300MB</p>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div class="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-primary text-2xl">analytics</span>
            </div>
            <h3 class="font-bold mb-2">智能分析</h3>
            <p class="text-sm text-slate-500">自动 EDA、预处理、特征提取</p>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <div class="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="material-symbols-outlined text-primary text-2xl">auto_graph</span>
            </div>
            <h3 class="font-bold mb-2">精准预测</h3>
            <p class="text-sm text-slate-500">多种朴素预测模型，评估指标可视化</p>
          </div>
        </div>
        
        <div class="mt-12">
          <button 
            @click="goToRegister"
            class="bg-primary text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-primary/30 transition-all text-lg"
          >
            立即开始免费使用
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  console.log('goToLogin clicked')
  router.push('/login')
}

const goToRegister = () => {
  console.log('goToRegister clicked')
  router.push('/register')
}
</script>
