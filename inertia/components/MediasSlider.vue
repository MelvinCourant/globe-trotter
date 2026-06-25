<script setup lang="ts">
import '../assets/css/components/_medias-slider.scss'
import {ref, useTemplateRef} from "vue";
import Button from "~/components/inputs/Button.vue";

defineProps({
  medias: {
    type: Array,
    default: () => []
  },
  lightbox: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'medium'
  }
})
defineEmits(['expandMedia'])

const mediasSliderTrack = useTemplateRef<HTMLDivElement>("mediasSliderTrack")
const activeIndex = ref(0)

function slideTo(index: number) {
  if(activeIndex.value === index || !mediasSliderTrack.value) return

  activeIndex.value = index

  const mediaWidth = document.querySelectorAll('.medias-slider__media')[0].clientWidth
  mediasSliderTrack.value.scrollTo({ left: index * mediaWidth, behavior: 'smooth' })
}

// Cropped variants are regenerated server-side at the same filename when their crop changes, so
// we append a crop-based version to bust the browser cache. The 'c' sentinel keeps a stable,
// distinct version for centered crops (covers resetting back to center).
function mediaUrl(media: unknown, variant: string): string {
  if (typeof media !== 'object' || media === null) {
    return `/uploads/${media}`
  }

  const m = media as Record<string, any>
  const key = m[variant] ?? m.normal
  const isCropped = variant === 'small' || variant === 'medium' || variant === 'large'

  if (!isCropped) return `/uploads/${key}`

  const crop = m.crop
  const version = !crop || (crop.x === 50 && crop.y === 50) ? 'c' : `${crop.x}-${crop.y}`
  return `/uploads/${key}?v=${version}`
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
        <Button
          v-if="lightbox"
          className="medias-slider__expand"
          size="small"
          :iconOnly="true"
          title="Afficher la photo en plein écran"
          @click="$emit('expandMedia', index)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3.33325 16.6666H2.49992V17.5H3.33325V16.6666ZM8.08917 13.0892C8.41461 12.7638 8.41461 12.2361 8.08917 11.9107C7.76374 11.5853 7.2361 11.5853 6.91066 11.9107L7.49992 12.5L8.08917 13.0892ZM3.33325 11.6666H2.49992V16.6666H3.33325H4.16659V11.6666H3.33325ZM3.33325 16.6666V17.5H8.33325V16.6666V15.8333H3.33325V16.6666ZM3.33325 16.6666L3.92251 17.2559L8.08917 13.0892L7.49992 12.5L6.91066 11.9107L2.744 16.0774L3.33325 16.6666Z" fill="var(--color)"/>
            <path d="M16.6667 3.33337H17.5001V2.50004H16.6667V3.33337ZM11.9108 6.91079C11.5854 7.23622 11.5854 7.76386 11.9108 8.0893C12.2363 8.41473 12.7639 8.41473 13.0893 8.0893L12.5001 7.50004L11.9108 6.91079ZM16.6667 8.33337H17.5001V3.33337H16.6667H15.8334V8.33337H16.6667ZM16.6667 3.33337V2.50004H11.6667V3.33337V4.16671H16.6667V3.33337ZM16.6667 3.33337L16.0775 2.74412L11.9108 6.91079L12.5001 7.50004L13.0893 8.0893L17.256 3.92263L16.6667 3.33337Z" fill="var(--color)"/>
          </svg>
        </Button>
        <picture>
          <source
            v-if="size === 'medium' && typeof media === 'object' && (media as any).large"
            media="(min-width: 600px) and (max-width: 767px)"
            :srcset="mediaUrl(media, 'large')"
          >
          <img
            :src="mediaUrl(media, size)"
            draggable="false"
          />
        </picture>
      </div>
    </div>
    <Button
      v-if="medias.length > 1"
      v-show="activeIndex > 0"
      className="medias-slider__arrow medias-slider__arrow--previous"
      size="small"
      :iconOnly="true"
      title="Voir la photo précédente"
      @click="slideTo(activeIndex - 1)"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1L4 7L10 13" stroke="var(--color)" stroke-width="2"/>
      </svg>
    </Button>
    <Button
      v-if="medias.length > 1"
      v-show="activeIndex < medias.length - 1"
      className="medias-slider__arrow medias-slider__arrow--next"
      size="small"
      :iconOnly="true"
      title="Voir la photo suivante"
      @click="slideTo(activeIndex + 1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4 13L10 7L4 1" stroke="var(--color)" stroke-width="2"/>
      </svg>
    </Button>
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
