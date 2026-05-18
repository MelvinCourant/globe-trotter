<script setup lang="ts">
import '../assets/css/components/_cluster.scss'

defineProps({
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'default',
  }
})
</script>

<template>
  <div :class="`cluster cluster--${type}`">
    {{ text }}
  </div>
</template>
