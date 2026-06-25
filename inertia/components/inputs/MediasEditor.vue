<script setup lang="ts">
import '../../assets/css/components/inputs/_medias-editor.scss'
import { computed, onMounted, onBeforeUnmount, reactive, ref } from 'vue'
import Button from "~/components/inputs/Button.vue";

type Crop = { x: number; y: number }

const props = defineProps<{
  items: { id: number; original: string; crop: Crop }[]
  startIndex?: number
}>()

const emit = defineEmits<{
  confirm: [crops: { id: number; crop: Crop }[]]
  close: []
}>()

const crops = reactive<Record<number, Crop>>(
  Object.fromEntries(props.items.map(i => [i.id, { ...i.crop }]))
)
const currentMediaIndex = ref(Math.min(props.startIndex ?? 0, props.items.length - 1))
const previewEl = ref<HTMLElement | null>(null)
const naturalDims: Record<number, { w: number; h: number }> = {}

const currentItem = computed(() => props.items[currentMediaIndex.value])
const currentCrop = computed(() => crops[currentItem.value.id])

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const dragging = ref(false)
let startX = 0
let startY = 0
let startCropX = 50
let startCropY = 50

onMounted(() => {
  props.items.forEach(loadDims)
})

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
})

function loadDims(item: { id: number; original: string }) {
  if (naturalDims[item.id]) return
  const img = new Image()
  img.onload = () => {
    naturalDims[item.id] = { w: img.naturalWidth, h: img.naturalHeight }
  }
  img.src = item.original
}

function goTo(index: number) {
  currentMediaIndex.value = index
}

function onDragStart(e: MouseEvent) {
  dragging.value = true
  startX = e.clientX
  startY = e.clientY
  startCropX = currentCrop.value.x
  startCropY = currentCrop.value.y
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (!dragging.value || !previewEl.value) return
  const dims = naturalDims[currentItem.value.id]
  if (!dims) return

  const rect = previewEl.value.getBoundingClientRect()
  const scale = Math.max(rect.width / dims.w, rect.height / dims.h)
  const overflowX = dims.w * scale - rect.width
  const overflowY = dims.h * scale - rect.height

  // Dragging right reveals the left part of the image -> position decreases
  const crop = crops[currentItem.value.id]
  crop.x = overflowX > 0 ? clamp(startCropX - ((e.clientX - startX) / overflowX) * 100, 0, 100) : 50
  crop.y = overflowY > 0 ? clamp(startCropY - ((e.clientY - startY) / overflowY) * 100, 0, 100) : 50
}

function onDragEnd() {
  dragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
}

function confirm() {
  emit('confirm', props.items.map(i => ({ id: i.id, crop: { ...crops[i.id] } })))
}
</script>

<template>
  <div class="medias-editor" @mousedown.self="emit('close')">
    <div class="medias-editor__container">
      <div class="medias-editor__header">
        <button
          class="medias-editor__button medias-editor__button--cancel"
          type="button"
          @click="emit('close')"
        >
          Annuler
        </button>
        <h3 class="medias-editor__title">Rogner (n’affecte pas le plein écran)</h3>
        <button
          class="medias-editor__button medias-editor__button--confirm"
          type="button"
          @click="confirm"
        >
          Valider
        </button>
      </div>
      <div class="medias-editor__body">
        <div
          ref="previewEl"
          class="medias-editor__preview"
          :style="{
            backgroundImage: `url('${currentItem.original}')`,
            backgroundPosition: `${currentCrop.x}% ${currentCrop.y}%`,
          }"
          @mousedown="onDragStart"
        >
          <div
            v-show="dragging"
            class="medias-editor__grid"
          >
            <svg width="700" height="360" viewBox="0 0 700 360" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="233" x2="233" y2="360" stroke="white" stroke-opacity="0.6"/>
              <line x1="467" x2="467" y2="360" stroke="white" stroke-opacity="0.6"/>
              <line y1="120.5" x2="700" y2="120.5" stroke="white" stroke-opacity="0.6"/>
              <line y1="240" x2="700" y2="240" stroke="white" stroke-opacity="0.6"/>
            </svg>
          </div>
        </div>
        <Button
          className="medias-editor__arrow medias-editor__arrow--previous"
          size="small"
          :iconOnly="true"
          v-show="!dragging"
          v-if="items.length > 1 && currentMediaIndex > 0"
          @click="goTo(currentMediaIndex - 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M7.41418 0.707092L1.41418 6.70709L7.41418 12.7071" stroke="#090101" stroke-width="2"/>
          </svg>
        </Button>
        <Button
          className="medias-editor__arrow medias-editor__arrow--next"
          size="small"
          :iconOnly="true"
          v-show="!dragging"
          v-if="items.length > 1 && currentMediaIndex < items.length - 1"
          @click="goTo(currentMediaIndex + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
            <path d="M0.707031 12.7071L6.70703 6.70709L0.707031 0.707092" stroke="#090101" stroke-width="2"/>
          </svg>
        </Button>
      </div>
    </div>
  </div>
</template>
