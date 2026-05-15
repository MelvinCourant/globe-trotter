<script setup>
import '../assets/css/components/_form-container.scss';

defineProps({
  title: {
    type: String,
    default: '',
  }
})
</script>

<template>
  <div class="form-container">
    <h1
      v-if="title"
      class="form-container__title"
    >
      {{ title }}
    </h1>
    <slot />
  </div>
</template>
