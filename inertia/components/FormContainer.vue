<script setup lang="ts">
import '../assets/css/components/_form-container.scss';
import {computed, onMounted, provide, ref} from "vue";
import Loader from "~/components/Loader.vue";

const props = defineProps({
  className: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: String,
    default: 'Chargement ...'
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

const internalLoading = ref(false)
const internalOverlay = ref('')

const isLoading = computed(() => props.loading || internalLoading.value)
const activeOverlay = computed(() => internalLoading.value ? internalOverlay.value : props.overlay)

provide('formLoading', (value: boolean, overlay = '') => {
  internalLoading.value = value
  internalOverlay.value = overlay
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
      v-if="isLoading"
      className="form-container__loader"
      :overlay="activeOverlay"
    />
  </div>
</template>
