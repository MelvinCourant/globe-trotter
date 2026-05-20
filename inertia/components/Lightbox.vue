<script setup lang="ts">
import '../assets/css/components/_lightbox.scss'
import {ref} from "vue";
import Button from "~/components/inputs/Button.vue";

const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0
  },
  medias: {
    type: Array,
    default: () => []
  },
})
defineEmits(['close'])

const activeIndex = ref(props.activeIndex)
</script>

<template>
  <div class="lightbox">
    <Button
      className="lightbox__close"
      size="small"
      :iconOnly="true"
      title="Fermer la fenètre"
      @click="$emit('close')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.6708 2.81334C16.0891 2.3951 16.768 2.39528 17.1864 2.81334C17.6047 3.23174 17.6047 3.91056 17.1864 4.32896L4.32899 17.1864C3.91059 17.6047 3.23177 17.6047 2.81337 17.1864C2.39531 16.768 2.39513 16.0891 2.81337 15.6708L15.6708 2.81334Z" fill="var(--color)"/>
        <path d="M2.81337 2.81334C3.23168 2.3951 3.91056 2.39528 4.32899 2.81334L17.1864 15.6708C17.6047 16.0892 17.6047 16.768 17.1864 17.1864C16.768 17.6047 16.0892 17.6047 15.6708 17.1864L2.81337 4.32896C2.39531 3.91053 2.39513 3.23165 2.81337 2.81334Z" fill="var(--color)"/>
      </svg>
    </Button>
    <div
      v-for="(media, index) in medias"
      :key="index"
      class="lightbox__media"
      v-show="index === activeIndex"
    >
      <img
        :src="`/uploads/${media}`"
        draggable="false"
      />
    </div>
    <button
      class="lightbox__arrow lightbox__arrow--previous"
      title="Voir l'image précédente"
      :disabled="activeIndex === 0"
      v-show="activeIndex > 0"
      @click="() => {
          if(activeIndex > 0) {
            activeIndex--
          }
      }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M37.5 15L22.5 30L37.5 45" stroke="var(--white)" stroke-width="5"/>
      </svg>
    </button>
    <button
      class="lightbox__arrow lightbox__arrow--next"
      title="Voir l'image suivante"
      :disabled="activeIndex === medias.length - 1"
      v-show="activeIndex < medias.length - 1"
      @click="() => {
        if(activeIndex < medias.length - 1) {
          activeIndex++
        }
      }"
      >
      <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60" fill="none">
        <path d="M22.5 15L37.5 30L22.5 45" stroke="var(--white)" stroke-width="5"/>
      </svg>
    </button>
    <div class="lightbox__dots" v-if="medias.length > 1">
      <input
        :class="[
          'lightbox__dot',
          {'lightbox__dot--active': activeIndex === index}
        ]"
        type="button"
        v-for="(media, index) in medias"
        :key="index"
        @click="activeIndex = index"
      >
    </div>
  </div>
</template>
