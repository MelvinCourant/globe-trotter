<script setup lang="ts">
import '../assets/css/components/_chip.scss'

defineProps({
  canBeDeleted: {
    type: Boolean,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    default: '',
  }
})

defineEmits(["deleteChip"]);
</script>

<template>
  <div class="chip">
    {{ text }}
    <button class="chip__delete" v-if="canBeDeleted" @click="$emit('deleteChip')">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M8.66663 0.666656L0.666626 8.66666" stroke="var(--primary)" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.666626 0.666656L8.66663 8.66666" stroke="var(--primary)" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>
</template>
