<script setup lang="ts">
import '../../assets/css/components/inputs/_gallery-input.scss'
import {nextTick, ref, useTemplateRef} from "vue";
import Button from "~/components/inputs/Button.vue";

const props = defineProps({
  error: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  medias: {
    type: Array,
    default: () => [],
  },
  maxLength: {
    type: Number,
    default: 0,
  }
})

const emit = defineEmits<{ updateMedias: [payload: { existing: string[], files: File[] }] }>()

const existingMedias = ref<string[]>([...(props.medias as string[])])
const files = ref<File[]>([])
const previews = ref<string[]>([...(props.medias as string[])])
const mediasSlider = useTemplateRef<HTMLDivElement>("mediasSlider")

let isGrabbing = false
let grabStartX = 0
let scrollStartLeft = 0

function onGrabStart(e: MouseEvent) {
  if (!mediasSlider.value) return
  isGrabbing = true
  grabStartX = e.clientX
  scrollStartLeft = mediasSlider.value.scrollLeft
  mediasSlider.value.style.cursor = 'grabbing'
}

function onGrabMove(e: MouseEvent) {
  if (!isGrabbing || !mediasSlider.value) return
  e.preventDefault()
  mediasSlider.value.scrollLeft = scrollStartLeft - (e.clientX - grabStartX)
}

function onGrabEnd() {
  if (!mediasSlider.value) return
  isGrabbing = false
  mediasSlider.value.style.cursor = 'grab'
}

async function scrollToLastMedia(noAnimation: boolean = false) {
  await nextTick();

  if (mediasSlider.value) {
    const items = mediasSlider.value.querySelectorAll<HTMLElement>('.gallery-input-media:not(.gallery-input-media--placeholder)')
    const lastItem = items[items.length - 1]

    if (lastItem) {
      if(noAnimation) {
        mediasSlider.value.scrollTo({ left: lastItem.offsetLeft - 20 })
      } else {
        mediasSlider.value.scrollTo({ left: lastItem.offsetLeft - 20, behavior: 'smooth' })
      }
    }
  }
}

async function addFiles(event: { target: any; }) {
  const input = event.target;
  const remaining = props.maxLength > 0 ? props.maxLength - previews.value.length : Infinity

  Array.from(input.files as FileList).slice(0, remaining).forEach((file: File) => {
    files.value.push(file)
    previews.value.push(URL.createObjectURL(file))
  })
  await scrollToLastMedia();
  emit('updateMedias', { existing: existingMedias.value.map(m => m.replace('/uploads/', '')), files: files.value });
}

function deleteFile(index: number) {
  if (index < existingMedias.value.length) {
    existingMedias.value.splice(index, 1)
    previews.value.splice(index, 1)
  } else {
    const fileIndex = index - existingMedias.value.length
    URL.revokeObjectURL(previews.value[index])
    files.value.splice(fileIndex, 1)
    previews.value.splice(index, 1)
  }
  emit('updateMedias', { existing: existingMedias.value.map(m => m.replace('/uploads/', '')), files: files.value });
}
</script>

<template>
  <div class="gallery-input">
    <label
      v-if="label"
      for="image"
      class="gallery-input__label"
    >
      {{ label }}
    </label>
    <div
      :class="[
        'gallery-input__medias',
        {'gallery-input__medias--empty': files.length === 0}
      ]"
      ref="mediasSlider"
      @mousedown="onGrabStart"
      @mousemove="onGrabMove"
      @mouseup="onGrabEnd"
      @mouseleave="onGrabEnd"
    >
      <div v-for="(media, index) in previews" class="gallery-input-media">
        <img :src="media" :alt="`Média ${index}`" draggable="false">
        <Button
          className="gallery-input-media__delete"
          size="small"
          :iconOnly="true"
          type="button"
          @click="deleteFile(index)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M8.33325 12.5L8.33325 10" stroke="#EB5656" stroke-width="1.66667" stroke-linecap="round"/>
            <path d="M11.6667 12.5L11.6667 10" stroke="#EB5656" stroke-width="1.66667" stroke-linecap="round"/>
            <path d="M2.5 5.83334H17.5C16.7234 5.83334 16.3351 5.83334 16.0289 5.96021C15.6205 6.12937 15.296 6.45382 15.1269 6.8622C15 7.16849 15 7.55677 15 8.33334V13.3333C15 14.9047 15 15.6904 14.5118 16.1785C14.0237 16.6667 13.238 16.6667 11.6667 16.6667H8.33333C6.76198 16.6667 5.97631 16.6667 5.48816 16.1785C5 15.6904 5 14.9047 5 13.3333V8.33334C5 7.55677 5 7.16849 4.87313 6.8622C4.70398 6.45382 4.37952 6.12937 3.97114 5.96021C3.66485 5.83334 3.27657 5.83334 2.5 5.83334Z" stroke="#EB5656" stroke-width="1.66667" stroke-linecap="round"/>
            <path d="M8.3902 2.80883C8.48516 2.72023 8.69441 2.64194 8.98548 2.5861C9.27655 2.53027 9.63319 2.5 10.0001 2.5C10.367 2.5 10.7236 2.53027 11.0147 2.5861C11.3058 2.64194 11.515 2.72023 11.61 2.80883" stroke="#EB5656" stroke-width="1.66667" stroke-linecap="round"/>
          </svg>
        </Button>
      </div>
      <div
        v-if="
          maxLength > 0 && previews.length < maxLength ||
          maxLength === 0
        "
        class="gallery-input-media gallery-input-media--placeholder"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path d="M2.82129 25.3958L6.41406 21.8031C8.94547 19.2717 10.2119 18.0057 11.583 17.89C12.2731 17.8318 12.9659 17.9654 13.585 18.2757C14.815 18.8924 15.5205 20.538 16.9307 23.8285L17.0312 24.0628C17.6447 25.4941 17.951 26.2102 18.4561 26.5228C18.8485 26.7657 19.3169 26.8555 19.7715 26.7757C20.3565 26.673 20.9067 26.122 22.0078 25.0208L22.2207 24.8089C23.5773 23.4523 24.2563 22.7737 25.0254 22.4876C25.871 22.1734 26.8019 22.1734 27.6475 22.4876C28.4166 22.7736 29.0954 23.4522 30.4521 24.8089L31.8662 26.222C33.1437 27.4995 34.876 28.218 36.6826 28.2181V4.11557C37.6238 6.37602 37.624 9.70689 37.624 15.0492V22.5746C37.624 29.6687 37.6238 33.2163 35.4199 35.4203C33.216 37.6241 29.6684 37.6234 22.5742 37.6234H15.0498C7.9558 37.6234 4.40808 37.6238 2.2041 35.4203C0.000186637 33.2163 5.27273e-10 29.6687 0 22.5746V15.0492C4.55848e-10 7.95497 0.000184244 4.40738 2.2041 2.20346C2.39872 2.00888 2.60421 1.83199 2.82129 1.67026V25.3958Z" fill="var(--primary-hover)"/>
          <path d="M15.0498 1.88086H22.5742C26.1744 1.88086 28.6855 1.88496 30.5801 2.13965C32.4206 2.3871 33.3957 2.83999 34.0898 3.53418C34.784 4.22836 35.236 5.20357 35.4834 7.04395C35.7381 8.93851 35.7422 11.4497 35.7422 15.0498V22.5742C35.7422 26.1745 35.7381 28.6855 35.4834 30.5801C35.236 32.4206 34.784 33.3957 34.0898 34.0898C33.3957 34.784 32.4206 35.236 30.5801 35.4834C28.6855 35.7381 26.1745 35.7422 22.5742 35.7422H15.0498C11.4497 35.7422 8.93851 35.7381 7.04395 35.4834C5.20357 35.236 4.22836 34.784 3.53418 34.0898C2.83999 33.3957 2.3871 32.4206 2.13965 30.5801C1.88496 28.6855 1.88086 26.1744 1.88086 22.5742V15.0498C1.88086 11.4497 1.88499 8.93849 2.13965 7.04395C2.3871 5.20345 2.83999 4.22837 3.53418 3.53418C4.22837 2.83999 5.20345 2.3871 7.04395 2.13965C8.9385 1.88499 11.4497 1.88086 15.0498 1.88086Z" stroke="var(--primary-hover)" stroke-width="3.76238"/>
          <circle cx="24.4552" cy="13.1683" r="3.76238" fill="var(--primary-hover)"/>
        </svg>
        <input
          id="image"
          class="gallery-input-media__input"
          name="image"
          type="file"
          accept=".png, .jpeg, .jpg, .webp, .HEIC"
          multiple
          @change="addFiles($event)"
        >
      </div>
    </div>
    <div
      v-if="error"
      class="gallery-input__error"
    >
      {{ error }}
    </div>
  </div>
</template>
