<script setup>
import '../assets/css/components/_form-container.scss';
import {onMounted, ref} from "vue";
import Loader from "~/components/Loader.vue";

defineProps({
  className: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
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
const isMobile = ref(false)

onMounted(() => {
  if(window.innerWidth < 768) {
    isMobile.value = true
  }

  const form = document.querySelector('.form-container form')

  if(form && !isMobile.value) {
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
    <Loader
      v-if="loading"
      className="form-container__loader"
      :overlay="true"
    />
  </div>
</template>
