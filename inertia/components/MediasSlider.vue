<script setup lang="ts">
import '../assets/css/components/_medias-slider.scss'
import {ref, useTemplateRef} from "vue";

defineProps({
  medias: {
    type: Array,
    default: () => []
  },
  size: {
    type: String,
    default: 'small'
  }
})

const mediasSliderTrack = useTemplateRef<HTMLDivElement>("mediasSliderTrack")
const activeIndex = ref(0)

function slideTo(index: number) {
  if(activeIndex.value === index || !mediasSliderTrack.value) return

  activeIndex.value = index

  const mediaWidth = document.querySelectorAll('.medias-slider__media')[0].clientWidth
  mediasSliderTrack.value.scrollTo({ left: index * mediaWidth, behavior: 'smooth' })
}
</script>

<template>
  <div
    :class="`medias-slider medias-slider--${size}`"
    v-if="medias.length > 0"
  >
    <div
      class="medias-slider__track"
      ref="mediasSliderTrack"
    >
      <div
        v-for="(media, index) in medias"
        :key="index"
        class="medias-slider__media"
      >
        <img
          :src="`/uploads/${media}`"
          draggable="false"
        />
      </div>
    </div>
    <div class="medias-slider__dots" v-if="medias.length > 1">
      <input
        :class="[
          'medias-slider__dot',
          {'medias-slider__dot--active': activeIndex === index}
        ]"
        type="button"
        v-for="(media, index) in medias"
        :key="index"
        @click="slideTo(index)"
      >
    </div>
  </div>
</template>
