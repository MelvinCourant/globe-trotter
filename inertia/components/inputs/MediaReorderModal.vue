<script setup lang="ts">
import '../../assets/css/components/inputs/_media-reorder-modal.scss'
import { ref, useTemplateRef } from 'vue'
import Button from '~/components/inputs/Button.vue'

const props = defineProps<{
  items: { id: number; preview: string }[]
}>()

const emit = defineEmits<{
  confirm: [orderedIds: number[]]
  close: []
}>()

const localItems = ref([...props.items])
const gridRef = useTemplateRef<HTMLDivElement>('grid')

const dragSourceIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dragOverBefore = ref(true)

// --- Shared reorder logic ---

function applyReorder(sourceIndex: number, targetIndex: number) {
  if (sourceIndex === targetIndex) return
  const source = localItems.value[sourceIndex]
  const newItems = [...localItems.value]
  newItems.splice(sourceIndex, 1)
  const adjustedTarget = targetIndex - (sourceIndex < targetIndex ? 1 : 0)
  const insertAt = Math.max(0, Math.min(adjustedTarget + (dragOverBefore.value ? 0 : 1), newItems.length))
  newItems.splice(insertAt, 0, source)
  localItems.value = newItems
}

function resetDragState() {
  dragSourceIndex.value = null
  dragOverIndex.value = null
}

function onDragStart(e: DragEvent, index: number) {
  dragSourceIndex.value = index
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  if (dragSourceIndex.value === index) {
    dragOverIndex.value = null
    return
  }
  dragOverIndex.value = index
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragOverBefore.value = e.clientX < rect.left + rect.width / 2
}

function onDragLeave(e: DragEvent, index: number) {
  const target = e.currentTarget as HTMLElement
  const related = e.relatedTarget as Node | null
  if ((!related || !target.contains(related)) && dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

function onDrop(e: DragEvent, targetIndex: number) {
  e.preventDefault()
  const sourceIndex = dragSourceIndex.value
  if (sourceIndex === null) return
  applyReorder(sourceIndex, targetIndex)
  resetDragState()
}

function onDragEnd() {
  resetDragState()
}

function onTouchStart(index: number) {
  dragSourceIndex.value = index
}

function onTouchMove(e: TouchEvent) {
  if (dragSourceIndex.value === null) return
  e.preventDefault()

  const touch = e.touches[0]
  const el = document.elementFromPoint(touch.clientX, touch.clientY)
  const itemEl = el?.closest<HTMLElement>('.media-reorder__item')

  if (!itemEl || !gridRef.value) {
    dragOverIndex.value = null
    return
  }

  const allItems = Array.from(gridRef.value.querySelectorAll<HTMLElement>('.media-reorder__item'))
  const targetIndex = allItems.indexOf(itemEl)

  if (targetIndex === -1 || targetIndex === dragSourceIndex.value) {
    dragOverIndex.value = null
    return
  }

  dragOverIndex.value = targetIndex
  const rect = itemEl.getBoundingClientRect()
  dragOverBefore.value = touch.clientX < rect.left + rect.width / 2
}

function onTouchEnd() {
  const sourceIndex = dragSourceIndex.value
  const targetIndex = dragOverIndex.value
  resetDragState()
  if (sourceIndex !== null && targetIndex !== null) {
    applyReorder(sourceIndex, targetIndex)
  }
}

function confirm() {
  emit('confirm', localItems.value.map(item => item.id))
}
</script>

<template>
  <div class="media-reorder" @click.self="$emit('close')">
    <div class="media-reorder__panel">
      <div class="media-reorder__header">
        <span class="media-reorder__title">Réorganiser les images</span>
        <Button size="small" :iconOnly="true" type="button" @click="$emit('close')">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15.6708 2.81334C16.0891 2.3951 16.768 2.39528 17.1864 2.81334C17.6047 3.23174 17.6047 3.91056 17.1864 4.32896L4.32899 17.1864C3.91059 17.6047 3.23177 17.6047 2.81337 17.1864C2.39531 16.768 2.39513 16.0891 2.81337 15.6708L15.6708 2.81334Z" fill="var(--color)"/>
            <path d="M2.81337 2.81334C3.23168 2.3951 3.91056 2.39528 4.32899 2.81334L17.1864 15.6708C17.6047 16.0892 17.6047 16.768 17.1864 17.1864C16.768 17.6047 16.0892 17.6047 15.6708 17.1864L2.81337 4.32896C2.39531 3.91053 2.39513 3.23165 2.81337 2.81334Z" fill="var(--color)"/>
          </svg>
        </Button>
      </div>

      <div
        class="media-reorder__grid-wrapper"
        @touchmove="onTouchMove"
        @touchend.passive="onTouchEnd"
      >
        <div ref="grid" class="media-reorder__grid">
          <div
            v-for="(item, index) in localItems"
            :key="item.id"
            :class="[
              'media-reorder__item',
              { 'media-reorder__item--dragging': dragSourceIndex === index },
              { 'media-reorder__item--drag-over-before': dragOverIndex === index && dragOverBefore },
              { 'media-reorder__item--drag-over-after': dragOverIndex === index && !dragOverBefore },
            ]"
            draggable="true"
            @dragstart="onDragStart($event, index)"
            @dragover="onDragOver($event, index)"
            @dragleave="onDragLeave($event, index)"
            @drop="onDrop($event, index)"
            @dragend="onDragEnd"
            @touchstart.passive="onTouchStart(index)"
          >
            <img :src="item.preview" :alt="`Média ${index + 1}`" draggable="false">
            <span class="media-reorder__item-badge">{{ index + 1 }}</span>
          </div>
        </div>
      </div>

      <div class="media-reorder__footer">
        <Button type="button" :style="'primary'" @click="confirm">Valider</Button>
        <Button type="button" @click="$emit('close')">Annuler</Button>
      </div>
    </div>
  </div>
</template>
