<script setup lang="ts">
import '../assets/css/components/_more.scss'
import {ref} from "vue";

defineProps({
  actions: {
    type: Array,
    required: true,
  }
})
defineEmits(['click'])

const menuOpen = ref(false)

window.addEventListener('click', (e) => {
  if(!e.target.closest('.more') && menuOpen.value) {
    menuOpen.value = false
  }
})
</script>

<template>
  <div class="more">
    <button
      class="more__toggle"
      @click="menuOpen = !menuOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="10.9999" cy="10.9999" r="0.916667" stroke="var(--color)" stroke-width="1.83333" stroke-linecap="round"/>
        <circle cx="5.49992" cy="10.9999" r="0.916667" stroke="var(--color)" stroke-width="1.83333" stroke-linecap="round"/>
        <circle cx="16.4999" cy="10.9999" r="0.916667" stroke="var(--color)" stroke-width="1.83333" stroke-linecap="round"/>
      </svg>
    </button>
    <ul class="more__actions" v-show="menuOpen">
      <li v-for="action in actions">
        <button
          :class="`more__action more__action--${action.style}`"
          @click="$emit('click', action.name); menuOpen = false"
        >
          {{ action.title }}
        </button>
      </li>
    </ul>
  </div>
</template>
