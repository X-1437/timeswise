<template>
  <MainLayout>
    <div class="p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">项目中心</h1>
            <p class="text-slate-500 dark:text-slate-400 mt-1">管理并开启您的时间序列分析项目</p>
          </div>
          <button 
            @click="createNewProject"
            class="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-primary/20 transition-all scale-100 active:scale-95"
          >
            <span class="material-symbols-outlined">add</span>
            <span>新建项目</span>
          </button>
        </div>
        
        <div class="mt-12 bg-primary/5 dark:bg-primary/10 rounded-2xl border-2 border-dashed border-primary/20 p-12 text-center">
          <div class="size-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mx-auto mb-6">
            <span class="material-symbols-outlined text-primary text-4xl">waving_hand</span>
          </div>
          <h2 class="text-xl font-bold mb-2">欢迎回来</h2>
          <p class="text-slate-600 dark:text-slate-400 mb-8 max-w-sm mx-auto">点击下方按钮开始新的分析流程，我们将协助您完成从数据导入到报告生成的所有步骤。</p>
          <button 
            @click="createNewProject"
            class="bg-primary text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2 mx-auto"
          >
            <span class="material-symbols-outlined">add_circle</span>
            <span>开始新的分析</span>
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const router = useRouter()

const isLoggedIn = ref(false)

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('isLoggedIn') === 'true'
})

const createNewProject = () => {
  if (!isLoggedIn.value) {
    router.push('/login')
  } else {
    router.push('/data-import')
  }
}
</script>
