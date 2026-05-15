<script setup>
import '../assets/css/components/_form-container.scss';
import {onMounted} from "vue";

defineProps({
  className: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'medium'
  },
  title: {
    type: String,
    default: '',
  }
})

onMounted(() => {
  const form = document.querySelector('.form-container form')

  if(form) {
    const inputs = form.querySelectorAll('input:not([type="file"])')
    const firstInput = inputs[0]

    firstInput.focus()
  }
})
</script>

<template>
  <div :class="`form-container form-container--${size} ${className}`">
    <h2
      v-if="title"
      class="form-container__title"
    >
      {{ title }}
    </h2>
    <slot />
  </div>
</template>
