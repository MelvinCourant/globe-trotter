<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import '../assets/css/components/_toaster.scss'
import type { Data } from '@generated/data'
import Navbar from "~/layouts/Navbar.vue";

const page = usePage<Data.SharedProps>()

initTheme()

watch(() => page.props.user, () => {
  if(page.props.user && page.props.user.theme) {
    initTheme()
  }
})

function initTheme() {
  if (page.props.user && page.props.user.theme !== 'auto') {
    if (
      page.props.user.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches ||
      page.props.user.theme === 'dark'
    ) {
      toggleTheme(true)
    } else {
      toggleTheme(false)
    }
  } else {
    const hours = new Date().getHours()
    const isDayTime = hours > 6 && hours < 20

    if(isDayTime) {
      toggleTheme(false)
    } else {
      toggleTheme(true)
    }
  }
}

function toggleTheme(dark: boolean) {
  if(dark) {
    document.documentElement.dataset.theme = 'dark'
  } else {
    document.documentElement.dataset.theme = 'light'
  }
}

watch(
  () => page.url,
  () => toast.dismiss()
)

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error)
    }
    if (flashMessages.success) {
      toast.success(flashMessages.success)
    }
  },
  { immediate: true }
)
</script>

<template>
  <Navbar/>
  <slot />

  <Toaster position="top-center" rich-colors :toastOptions="{
    class: 'toaster',
  }"/>
</template>
