<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="handleCancel">
      <div class="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-4 mb-4">
          <div class="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <span class="material-symbols-outlined text-orange-500">{{ icon }}</span>
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
        </div>
        <p class="text-slate-600 dark:text-slate-400 mb-6">{{ message }}</p>
        <div class="flex gap-3 justify-end">
          <button @click="handleCancel" class="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {{ cancelText }}
          </button>
          <button @click="handleConfirm" class="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '确认操作'
  },
  message: {
    type: String,
    default: '确定要执行此操作吗？'
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  icon: {
    type: String,
    default: 'warning'
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const show = ref(false)

watch(() => props.modelValue, (val) => {
  show.value = val
})

const handleConfirm = () => {
  emit('confirm')
  close()
}

const handleCancel = () => {
  emit('cancel')
  close()
}

const close = () => {
  show.value = false
  emit('update:modelValue', false)
}
</script>
