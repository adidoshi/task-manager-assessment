<script setup lang="ts">
defineProps<{
  open: boolean
  title: string
  message: string
}>()
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="list">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-ink-900/40 backdrop-blur-sm"
        @click.self="emit('cancel')"
        data-testid="confirm-dialog-backdrop"
      >
        <div
          class="w-full max-w-[420px] bg-white rounded-2xl shadow-modal border border-border-subtle p-6"
          data-testid="confirm-dialog"
        >
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-priority-high flex items-center justify-center text-priority-highFg shrink-0">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 class="text-[16px] font-semibold text-ink-900">{{ title }}</h3>
              <p class="mt-1 text-body-xs text-ink-500">{{ message }}</p>
            </div>
          </div>
          <div class="mt-5 flex items-center justify-end gap-2">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-[13px] font-semibold text-ink-700 hover:bg-canvas border border-border-subtle"
              @click="emit('cancel')"
              data-testid="confirm-cancel"
            >Cancel</button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-priority-highFg hover:brightness-95"
              @click="emit('confirm')"
              data-testid="confirm-ok"
            >Delete</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>