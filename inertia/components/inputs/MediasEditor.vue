<script setup lang="ts">
import '../../assets/css/components/inputs/_medias-editor.scss'
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from 'vue'
import Button from "~/components/inputs/Button.vue";
import MediasReorder from "~/components/inputs/MediasReorder.vue";

type Crop = { x: number; y: number }

const props = defineProps<{
  items: { id: number; original: string; crop: Crop }[]
  startIndex?: number
}>()

const emit = defineEmits<{
  confirm: [items: { id: number; crop: Crop }[]]
  close: []
}>()

const localItems = ref([...props.items])
const crops = reactive<Record<number, Crop>>(
  Object.fromEntries(props.items.map(i => [i.id, { ...i.crop }]))
)
const currentMediaIndex = ref(Math.min(props.startIndex ?? 0, props.items.length - 1))
const showReorder = ref(false)
const isMobile = ref(false)
const reorderEl = ref<{ $el: HTMLElement } | null>(null)
const previewEl = ref<HTMLElement | null>(null)
const naturalDims: Record<number, { w: number; h: number }> = {}

const currentItem = computed(() => localItems.value[currentMediaIndex.value])
const currentCrop = computed(() => (currentItem.value ? crops[currentItem.value.id] : { x: 50, y: 50 }))
const reorderVisible = computed(() => (showReorder.value || isMobile.value) && localItems.value.length > 1)

const mobileQuery = window.matchMedia('(max-width: 767px)')
const onMobileChange = (e: MediaQueryListEvent | MediaQueryList) => { isMobile.value = e.matches }

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const dragging = ref(false)
let startX = 0
let startY = 0
let startCropX = 50
let startCropY = 50

onMounted(() => {
  localItems.value.forEach(loadDims)
  onMobileChange(mobileQuery)
  mobileQuery.addEventListener('change', onMobileChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  document.removeEventListener('mousedown', onReorderOutsideClick)
  mobileQuery.removeEventListener('change', onMobileChange)
})

watch(showReorder, (open) => {
  if (open) {
    document.addEventListener('mousedown', onReorderOutsideClick)
  } else {
    document.removeEventListener('mousedown', onReorderOutsideClick)
  }
})

function onReorderOutsideClick(e: MouseEvent) {
  const root = reorderEl.value?.$el
  if (root && !root.contains(e.target as Node)) {
    showReorder.value = false
  }
}

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

function onReorder(from: number, to: number) {
  const list = localItems.value
  const [moved] = list.splice(from, 1)
  list.splice(to, 0, moved)

  const current = currentMediaIndex.value
  if (current === from) {
    currentMediaIndex.value = to
  } else if (from < current && to >= current) {
    currentMediaIndex.value = current - 1
  } else if (from > current && to <= current) {
    currentMediaIndex.value = current + 1
  }
}

function onDelete(index: number) {
  localItems.value.splice(index, 1)
  if (index < currentMediaIndex.value) currentMediaIndex.value--
  currentMediaIndex.value = clamp(currentMediaIndex.value, 0, Math.max(localItems.value.length - 1, 0))
}

function onDragStart(e: PointerEvent) {
  dragging.value = true
  startX = e.clientX
  startY = e.clientY
  startCropX = currentCrop.value.x
  startCropY = currentCrop.value.y
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', onDragEnd)
}

function onDragMove(e: PointerEvent) {
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
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
}

function confirm() {
  emit('confirm', localItems.value.map(i => ({ id: i.id, crop: { ...crops[i.id] } })))
}
</script>

<template>
  <div class="medias-editor">
    <div class="medias-editor__container">
      <div class="medias-editor__header">
        <button
          class="medias-editor__button medias-editor__button--cancel"
          type="button"
          @click="emit('close')"
        >
          Annuler
        </button>
        <h3 class="medias-editor__title">
          Rogner
          <span class="medias-editor__hint">(n’affecte pas le plein écran)</span>
        </h3>
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
          v-if="currentItem"
          ref="previewEl"
          class="medias-editor__preview"
          :style="{
            backgroundImage: `url('${currentItem.original}')`,
            backgroundPosition: `${currentCrop.x}% ${currentCrop.y}%`,
          }"
          @pointerdown="onDragStart"
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
          title="Voir la photo précédente"
          v-show="!dragging"
          v-if="localItems.length > 1 && currentMediaIndex > 0"
          @click="goTo(currentMediaIndex - 1)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1L4 7L10 13" stroke="var(--color)" stroke-width="2"/>
          </svg>
        </Button>
        <Button
          className="medias-editor__arrow medias-editor__arrow--next"
          size="small"
          :iconOnly="true"
          title="Voir la photo suivante"
          v-show="!dragging"
          v-if="localItems.length > 1 && currentMediaIndex < localItems.length - 1"
          @click="goTo(currentMediaIndex + 1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M4 13L10 7L4 1" stroke="var(--color)" stroke-width="2"/>
          </svg>
        </Button>
        <Button
          v-if="localItems.length > 1 && !isMobile"
          className="medias-editor__reorder"
          size="small"
          :iconOnly="true"
          title="Réorganiser l'ordre des photos"
          v-show="!dragging && !showReorder"
          @click="showReorder = !showReorder"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.99996 2.5L10.5205 1.84928L9.99996 1.43281L9.47938 1.84928L9.99996 2.5ZM9.16663 7.5C9.16663 7.96024 9.53972 8.33333 9.99996 8.33333C10.4602 8.33333 10.8333 7.96024 10.8333 7.5H9.99996H9.16663ZM13.3333 5.16667L13.8539 4.51594L10.5205 1.84928L9.99996 2.5L9.47938 3.15072L12.8127 5.81739L13.3333 5.16667ZM9.99996 2.5L9.47938 1.84928L6.14605 4.51594L6.66663 5.16667L7.18721 5.81739L10.5205 3.15072L9.99996 2.5ZM9.99996 2.5H9.16663V7.5H9.99996H10.8333V2.5H9.99996Z" fill="var(--color)"/>
            <path d="M17.5 9.99984L18.1507 10.5204L18.5672 9.99984L18.1507 9.47926L17.5 9.99984ZM12.5 9.1665C12.0398 9.1665 11.6667 9.5396 11.6667 9.99984C11.6667 10.4601 12.0398 10.8332 12.5 10.8332L12.5 9.99984L12.5 9.1665ZM14.8333 13.3332L15.4841 13.8537L18.1507 10.5204L17.5 9.99984L16.8493 9.47926L14.1826 12.8126L14.8333 13.3332ZM17.5 9.99984L18.1507 9.47926L15.4841 6.14592L14.8333 6.6665L14.1826 7.18708L16.8493 10.5204L17.5 9.99984ZM17.5 9.99984L17.5 9.1665L12.5 9.1665L12.5 9.99984L12.5 10.8332L17.5 10.8332L17.5 9.99984Z" fill="var(--color)"/>
            <path d="M9.99996 17.5L10.5205 18.1507L9.99996 18.5672L9.47938 18.1507L9.99996 17.5ZM9.16663 12.5C9.16663 12.0398 9.53972 11.6667 9.99996 11.6667C10.4602 11.6667 10.8333 12.0398 10.8333 12.5H9.99996H9.16663ZM13.3333 14.8333L13.8539 15.4841L10.5205 18.1507L9.99996 17.5L9.47938 16.8493L12.8127 14.1826L13.3333 14.8333ZM9.99996 17.5L9.47938 18.1507L6.14605 15.4841L6.66663 14.8333L7.18721 14.1826L10.5205 16.8493L9.99996 17.5ZM9.99996 17.5H9.16663V12.5H9.99996H10.8333V17.5H9.99996Z" fill="var(--color)"/>
            <path d="M2.5 9.99984L1.84928 10.5204L1.43281 9.99984L1.84928 9.47926L2.5 9.99984ZM7.5 9.1665C7.96024 9.1665 8.33333 9.5396 8.33333 9.99984C8.33333 10.4601 7.96024 10.8332 7.5 10.8332L7.5 9.99984L7.5 9.1665ZM5.16667 13.3332L4.51594 13.8537L1.84928 10.5204L2.5 9.99984L3.15072 9.47926L5.81739 12.8126L5.16667 13.3332ZM2.5 9.99984L1.84928 9.47926L4.51594 6.14592L5.16667 6.6665L5.81739 7.18708L3.15072 10.5204L2.5 9.99984ZM2.5 9.99984L2.5 9.1665L7.5 9.1665L7.5 9.99984L7.5 10.8332L2.5 10.8332L2.5 9.99984Z" fill="var(--color)"/>
          </svg>
        </Button>
        <MediasReorder
          ref="reorderEl"
          v-if="reorderVisible"
          v-show="!dragging"
          :items="localItems"
          :currentMediaIndex="currentMediaIndex"
          @select="goTo"
          @reorder="onReorder"
          @delete="onDelete"
        />
      </div>
    </div>
  </div>
</template>
