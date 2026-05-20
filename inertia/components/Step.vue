<script setup lang="ts">
import '../assets/css/components/_step.scss'
import MediasSlider from "~/components/MediasSlider.vue";
import Chip from "~/components/Chip.vue";
import {computed, onMounted, ref, watch} from "vue";
import {Link} from "@inertiajs/vue3";
import Button from "~/components/inputs/Button.vue";
import More from "~/components/More.vue";

const props = defineProps({
  nextStep: {
    type: String,
    default: ""
  },
  previousStep: {
    type: String,
    default: ""
  },
  step: {
    type: Object,
    required: true
  },
  stepIndex: {
    type: Number,
    required: true
  },
  totalSteps: {
    type: Number,
    required: true
  },
  travel: {
    type: Object,
    required: true
  }
})
const emits = defineEmits(['close', 'expandMedia', 'updateStep', 'deleteStep']);

const stepRef = ref<HTMLElement | null>(null)
const translateY = ref(0)
const isDragging = ref(false)
let dragStartY = 0
let dragStartTranslate = 0
const actions = [
  {
    name: 'update',
    title: 'Modifier',
    style: 'default',
  },
  {
    name: 'delete',
    title: 'Supprimer',
    style: 'danger',
  }
]
const formatDate = (dateStr: string, options: Intl.DateTimeFormatOptions) =>
  new Date(dateStr).toLocaleDateString('fr-FR', options)
const isMobile = ref(false)
const noAnimations = ref(false)

const datesFormated = computed(() => {
  const start = props.step.startDate as string
  const end = props.step.endDate as string
  const startDate = new Date(start)
  const endDate = new Date(end)

  const daysDiff = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const suffix = daysDiff > 1 ? ` (${daysDiff} jours)` : ''

  const sameMonth = startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()
  const sameDay = startDate.toDateString() === endDate.toDateString()

  if (sameDay) {
    return formatDate(start, { day: 'numeric', month: 'long', year: 'numeric' })
  }

  if (sameMonth) {
    const startDay = startDate.getDate()
    const endFormatted = formatDate(end, { day: 'numeric', month: 'long', year: 'numeric' })
    return `${startDay}-${endFormatted}${suffix}`
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear()

  if (sameYear) {
    const startFormatted = formatDate(start, { day: 'numeric', month: 'long' })
    const endFormatted = formatDate(end, { day: 'numeric', month: 'long', year: 'numeric' })
    return `${startFormatted} - ${endFormatted}${suffix}`
  }

  const startFormatted = formatDate(start, { day: 'numeric', month: 'long', year: 'numeric' })
  const endFormatted = formatDate(end, { day: 'numeric', month: 'long', year: 'numeric' })
  return `${startFormatted} - ${endFormatted}${suffix}`
})

onMounted(() => {
  if(window.innerWidth < 768) {
    isMobile.value = true
  }
})

window.addEventListener("resize", () => {
  if(window.innerWidth < 768 && !isMobile.value) {
    isMobile.value = true
  } else if(window.innerWidth >= 768 && isMobile.value) {
    isMobile.value = false
  }
})

function handleAction(actionName: string) {
  if(actionName === 'update') {
    emits('updateStep')
  } else {
    emits('deleteStep')
  }
}

function onDragStart(e: TouchEvent) {
  noAnimations.value = true
  isDragging.value = true
  dragStartY = e.touches[0].clientY
  dragStartTranslate = translateY.value
}

function onDragMove(e: TouchEvent) {
  if (!isDragging.value) return
  const delta = e.touches[0].clientY - dragStartY
  translateY.value = Math.max(0, dragStartTranslate + delta)
}

function onDragEnd() {
  if (!isDragging.value) return
  isDragging.value = false

  const stepHeight = stepRef.value?.offsetHeight ?? 0

  if (translateY.value > stepHeight * 0.3) {
    translateY.value = stepHeight
    setTimeout(() => emits('close'), 300)
  } else {
    translateY.value = 0
  }
}
</script>

<template>
  <div
    :class="['step', {'step--no-animations': noAnimations}]"
    ref="stepRef"
    :style="isMobile ? { transform: `translateY(${translateY}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease' } : {}"
  >
    <div
      class="step__drag-handle"
      v-if="isMobile"
      @touchstart="onDragStart"
      @touchmove.prevent="onDragMove"
      @touchend="onDragEnd"
    ></div>
    <Button
      className="step__close"
      size="small"
      :iconOnly="true"
      title="Fermer l'étape"
      @click="$emit('close')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.6708 2.81334C16.0891 2.3951 16.768 2.39528 17.1864 2.81334C17.6047 3.23174 17.6047 3.91056 17.1864 4.32896L4.32899 17.1864C3.91059 17.6047 3.23177 17.6047 2.81337 17.1864C2.39531 16.768 2.39513 16.0891 2.81337 15.6708L15.6708 2.81334Z" fill="var(--color)"/>
        <path d="M2.81337 2.81334C3.23168 2.3951 3.91056 2.39528 4.32899 2.81334L17.1864 15.6708C17.6047 16.0892 17.6047 16.768 17.1864 17.1864C16.768 17.6047 16.0892 17.6047 15.6708 17.1864L2.81337 4.32896C2.39531 3.91053 2.39513 3.23165 2.81337 2.81334Z" fill="var(--color)"/>
      </svg>
    </Button>
    <MediasSlider
      :lightbox="true"
      :medias="step.medias"
      @expandMedia="$emit('expandMedia', $event)"
    />
    <div class="step__content">
      <Chip :text="travel.title"/>
      <div class="step__title-update">
        <h2 class="step__title">
          {{ step.title }}
        </h2>
        <More
          :actions="actions"
          @click="handleAction"
        />
      </div>
      <div class="step__details">
        <div class="step__detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path d="M6.22217 0.777771V-6.91414e-06H6.22215L6.22217 0.777771ZM11.6665 6.22211H12.4443V6.22209L11.6665 6.22211ZM6.53174 13.0698L6.88974 13.7603L6.88985 13.7602L6.53174 13.0698ZM5.9126 13.0698L5.55448 13.7602L5.55448 13.7602L5.9126 13.0698ZM0.777832 6.22211L5.4121e-05 6.22209V6.22211H0.777832ZM6.22217 3.8891V3.11132H6.22209L6.22217 3.8891ZM3.88916 6.22211L3.11138 6.22209V6.22211H3.88916ZM6.22217 8.55511L6.22209 9.33289H6.22217V8.55511ZM8.55615 6.22211H9.33393V6.22209L8.55615 6.22211ZM6.22217 0.777771V1.55555C8.79945 1.55555 10.8887 3.64482 10.8887 6.22212L11.6665 6.22211L12.4443 6.22209C12.4442 2.78573 9.65859 -6.91414e-06 6.22217 -6.91414e-06V0.777771ZM11.6665 6.22211H10.8887C10.8887 7.89106 10.0393 9.26785 8.97929 10.3371C7.91999 11.4056 6.7154 12.0983 6.17362 12.3793L6.53174 13.0698L6.88985 13.7602C7.50147 13.443 8.86427 12.6626 10.084 11.4323C11.303 10.2027 12.4443 8.45475 12.4443 6.22211H11.6665ZM6.53174 13.0698L6.17374 12.3793C6.18444 12.3737 6.20139 12.3685 6.22213 12.3685C6.24288 12.3685 6.2599 12.3737 6.27071 12.3793L5.9126 13.0698L5.55448 13.7602C5.97575 13.9787 6.4687 13.9785 6.88974 13.7603L6.53174 13.0698ZM5.9126 13.0698L6.27072 12.3793C5.7289 12.0983 4.52431 11.4056 3.46501 10.3371C2.40499 9.2678 1.55561 7.89102 1.55561 6.22211H0.777832H5.4121e-05C5.4121e-05 8.45471 1.14131 10.2026 2.36031 11.4322C3.58002 12.6626 4.94282 13.4429 5.55448 13.7602L5.9126 13.0698ZM0.777832 6.22211L1.55561 6.22212C1.55566 3.64487 3.64493 1.5556 6.22218 1.55555L6.22217 0.777771L6.22215 -6.91414e-06C2.78581 5.99027e-05 0.000121176 2.78575 5.4121e-05 6.22209L0.777832 6.22211ZM6.22217 3.8891L6.22209 3.11132C4.50412 3.1115 3.11141 4.50392 3.11138 6.22209L3.88916 6.22211L4.66694 6.22212C4.66695 5.36317 5.36314 4.66697 6.22225 4.66688L6.22217 3.8891ZM3.88916 6.22211H3.11138C3.11138 7.94032 4.50412 9.33272 6.22209 9.33289L6.22217 8.55511L6.22225 7.77734C5.36311 7.77725 4.66694 7.08106 4.66694 6.22211H3.88916ZM6.22217 8.55511V9.33289C7.93996 9.33289 9.33393 7.94075 9.33393 6.22211H8.55615H7.77837C7.77837 7.08079 7.0817 7.77734 6.22217 7.77734V8.55511ZM8.55615 6.22211L9.33393 6.22209C9.3339 4.50349 7.93996 3.11132 6.22217 3.11132V3.8891V4.66688C7.08167 4.66688 7.77836 5.36343 7.77837 6.22212L8.55615 6.22211Z" fill="var(--color-secondary)"/>
          </svg>
          {{ step.place }}
        </div>
        <div class="step__detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7.00002" cy="7.00002" r="6.3" stroke="var(--color-secondary)" stroke-width="1.4"/>
            <path d="M10.1501 7.00005H7.17512C7.07847 7.00005 7.00012 6.9217 7.00012 6.82505V4.55005" stroke="var(--color-secondary)" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          {{ datesFormated }}
        </div>
      </div>
      <p
        v-if="step.description"
        class="step__description"
      >{{ step.description }}</p>
      <div
        v-if="step.link"
        class="step__link"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9.91167 7.44102L11.5587 5.79396C12.6958 4.65691 12.6958 2.81337 11.5587 1.67632C10.4217 0.53926 8.57814 0.539261 7.44108 1.67632L5.79402 3.32338M3.32344 5.79396L1.67638 7.44102C0.539321 8.57808 0.539321 10.4216 1.67638 11.5587C2.81343 12.6957 4.65697 12.6957 5.79403 11.5587L7.44108 9.91161" stroke="var(--primary)" stroke-width="1.64706" stroke-linecap="round"/>
        </svg>
        <a :href="step.link" target="_blank">{{ step.link }}</a>
      </div>
    </div>
    <div class="step__pager" v-if="totalSteps > 1">
      <Link
        v-if="previousStep"
        class="step__page"
        :href="`?step=${previousStep}`"
        preserve-state
        title="Voir l'étape précédente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
          <path d="M1.76782 5.88391L0.883939 5.00003L5.53131e-05 5.88391L0.883939 6.76779L1.76782 5.88391ZM16.7678 7.13391C17.4582 7.13391 18.0178 6.57427 18.0178 5.88391C18.0178 5.19356 17.4582 4.63391 16.7678 4.63391V5.88391V7.13391ZM6.76782 0.883911L5.88394 2.76566e-05L0.883939 5.00003L1.76782 5.88391L2.65171 6.76779L7.65171 1.76779L6.76782 0.883911ZM1.76782 5.88391L0.883939 6.76779L5.88394 11.7678L6.76782 10.8839L7.65171 10L2.65171 5.00003L1.76782 5.88391ZM1.76782 5.88391V7.13391H16.7678V5.88391V4.63391H1.76782V5.88391Z" fill="var(--color)"/>
        </svg>
      </Link>
      <div v-else class="step__page step__page--disabled">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
          <path d="M1.76782 5.88391L0.883939 5.00003L5.53131e-05 5.88391L0.883939 6.76779L1.76782 5.88391ZM16.7678 7.13391C17.4582 7.13391 18.0178 6.57427 18.0178 5.88391C18.0178 5.19356 17.4582 4.63391 16.7678 4.63391V5.88391V7.13391ZM6.76782 0.883911L5.88394 2.76566e-05L0.883939 5.00003L1.76782 5.88391L2.65171 6.76779L7.65171 1.76779L6.76782 0.883911ZM1.76782 5.88391L0.883939 6.76779L5.88394 11.7678L6.76782 10.8839L7.65171 10L2.65171 5.00003L1.76782 5.88391ZM1.76782 5.88391V7.13391H16.7678V5.88391V4.63391H1.76782V5.88391Z" fill="var(--color)"/>
        </svg>
      </div>
      <span class="step__page-index">{{ stepIndex }}/{{ totalSteps }}</span>
      <Link
        v-if="nextStep"
        class="step__page"
        :href="`?step=${nextStep}`"
        preserve-state
        title="Voir l'étape suivante"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
          <path d="M16.25 5.88391L17.1339 6.76779L18.0178 5.88391L17.1339 5.00003L16.25 5.88391ZM1.25 4.63391C0.559644 4.63391 0 5.19356 0 5.88391C0 6.57427 0.559644 7.13391 1.25 7.13391V5.88391V4.63391ZM11.25 10.8839L12.1339 11.7678L17.1339 6.76779L16.25 5.88391L15.3661 5.00003L10.3661 10L11.25 10.8839ZM16.25 5.88391L17.1339 5.00003L12.1339 2.76566e-05L11.25 0.883911L10.3661 1.76779L15.3661 6.76779L16.25 5.88391ZM16.25 5.88391V4.63391L1.25 4.63391V5.88391V7.13391L16.25 7.13391V5.88391Z" fill="var(--color)"/>
        </svg>
      </Link>
      <div v-else class="step__page step__page--disabled">
        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
          <path d="M16.25 5.88391L17.1339 6.76779L18.0178 5.88391L17.1339 5.00003L16.25 5.88391ZM1.25 4.63391C0.559644 4.63391 0 5.19356 0 5.88391C0 6.57427 0.559644 7.13391 1.25 7.13391V5.88391V4.63391ZM11.25 10.8839L12.1339 11.7678L17.1339 6.76779L16.25 5.88391L15.3661 5.00003L10.3661 10L11.25 10.8839ZM16.25 5.88391L17.1339 5.00003L12.1339 2.76566e-05L11.25 0.883911L10.3661 1.76779L15.3661 6.76779L16.25 5.88391ZM16.25 5.88391V4.63391L1.25 4.63391V5.88391V7.13391L16.25 7.13391V5.88391Z" fill="var(--color)"/>
        </svg>
      </div>
    </div>
  </div>
</template>
