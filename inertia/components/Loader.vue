<script setup>
import '../assets/css/components/_loader.scss'
defineProps({
  className: {
    type: String,
    default: ''
  },
  overlay: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div :class="`loader ${className}`">
    <div class="loader__inner">
    <div></div>
  </div></div>
  <div
    v-if="overlay"
    class="loader__overlay"
  >
    <span>{{ overlay }}</span>
  </div>
</template>
