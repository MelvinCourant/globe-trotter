<script setup lang="ts">
import '../../assets/css/components/inputs/_medias-reorder.scss'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from "~/components/inputs/Button.vue";

const props = defineProps<{
  items: { id: number; original: string;}[],
  currentMediaIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
  reorder: [from: number, to: number]
  delete: [index: number]
}>()

const draggedIndex = ref<number | null>(null)

const sliderEl = ref<HTMLElement | null>(null)
const canScrollPrevious = ref(false)
const canScrollNext = ref(false)

function updateScrollState() {
  const el = sliderEl.value
  if (!el) return
  canScrollPrevious.value = el.scrollLeft > 0
  canScrollNext.value = Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth
}

function scrollBy(direction: number) {
  sliderEl.value?.scrollBy({ left: direction * sliderEl.value.clientWidth * 0.8, behavior: 'smooth' })
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('resize', updateScrollState)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScrollState)
})

watch(() => props.items.length, () => {
  nextTick(updateScrollState)
})

function onDragStart(index: number) {
  draggedIndex.value = index
}

function onDragEnter(index: number) {
  if (draggedIndex.value === null || draggedIndex.value === index) return
  emit('reorder', draggedIndex.value, index)
  draggedIndex.value = index
}

function onDragEnd() {
  draggedIndex.value = null
}
</script>

<template>
  <div class="medias-reorder">
    <Button
      className="medias-reorder__arrow medias-reorder__arrow--previous"
      size="small"
      :iconOnly="true"
      type="button"
      title="Photos précédentes"
      v-show="canScrollPrevious && draggedIndex === null"
      @click="scrollBy(-1)"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1L4 7L10 13" stroke="var(--color)" stroke-width="2"/>
      </svg>
    </Button>
    <div
      ref="sliderEl"
      class="medias-reorder__slider"
      @scroll="updateScrollState"
    >
      <div
        class="medias-reorder__item"
        :class="{ 'medias-reorder__item--dragging': draggedIndex === index }"
        v-for="(item, index) in items"
        :key="item.id"
        draggable="true"
        :style="{
          backgroundImage: index === currentMediaIndex
            ? `url('${item.original}')`
            : `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${item.original}')`,
        }"
        @click="emit('select', index)"
        @dragstart="onDragStart(index)"
        @dragenter.prevent="onDragEnter(index)"
        @dragover.prevent
        @dragend="onDragEnd"
      >
        <Button
          className="medias-reorder__delete"
          size="very-small"
          :iconOnly="true"
          type="button"
          v-if="currentMediaIndex === index"
          @click.stop="emit('delete', index)"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.375 8.125L4.375 6.25" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round"/>
            <path d="M6.875 8.125L6.875 6.25" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round"/>
            <path d="M0 3.125H11.25C10.6676 3.125 10.3764 3.125 10.1466 3.22015C9.84036 3.34702 9.59702 3.59036 9.47015 3.89665C9.375 4.12636 9.375 4.41757 9.375 5V8.75C9.375 9.92851 9.375 10.5178 9.00888 10.8839C8.64277 11.25 8.05351 11.25 6.875 11.25H4.375C3.19649 11.25 2.60723 11.25 2.24112 10.8839C1.875 10.5178 1.875 9.92851 1.875 8.75V5C1.875 4.41757 1.875 4.12636 1.77985 3.89665C1.65298 3.59036 1.40964 3.34702 1.10335 3.22015C0.87364 3.125 0.582427 3.125 0 3.125Z" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round"/>
            <path d="M4.41759 0.856619C4.48881 0.790171 4.64574 0.731455 4.86405 0.689577C5.08235 0.647699 5.34983 0.625 5.625 0.625C5.90017 0.625 6.16765 0.647699 6.38595 0.689577C6.60426 0.731455 6.76119 0.790171 6.83241 0.856619" stroke="var(--primary)" stroke-width="1.25" stroke-linecap="round"/>
          </svg>
        </Button>
      </div>
    </div>
    <Button
      className="medias-reorder__arrow medias-reorder__arrow--next"
      size="small"
      :iconOnly="true"
      type="button"
      title="Photos suivantes"
      v-show="canScrollNext && draggedIndex === null"
      @click="scrollBy(1)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M4 13L10 7L4 1" stroke="var(--color)" stroke-width="2"/>
      </svg>
    </Button>
  </div>
</template>
