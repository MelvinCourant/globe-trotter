<script setup lang="ts">
import '../assets/css/components/_popup.scss'
import Chip from "~/components/Chip.vue";
import {computed} from "vue";
import MediasSlider from "~/components/MediasSlider.vue";
import {Link} from "@inertiajs/vue3";

const props = defineProps({
  step: {
    type: Object,
    required: true
  },
  travel: {
    type: Object,
    required: true
  }
})

const stepHref = computed(() => {
  const params = new URLSearchParams(window.location.search)
  params.set('step', props.step.id)
  return `?${params}`
})

const formatDate = (dateStr: string, options: Intl.DateTimeFormatOptions) =>
  new Date(dateStr).toLocaleDateString('fr-FR', options)

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
</script>

<template>
  <div class="popup">
    <MediasSlider :medias="step.medias" size="small"/>
    <Link
      :href="stepHref"
      title="Afficher le détail de cette étape"
      preserve-state
      class="popup__content"
    >
      <Chip :text="travel.title"/>
      <h2 class="popup__title">
        {{ step.title }}
      </h2>
      <div class="popup__details">
        <div class="popup__detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
            <path d="M6.22217 0.777771V-6.91414e-06H6.22215L6.22217 0.777771ZM11.6665 6.22211H12.4443V6.22209L11.6665 6.22211ZM6.53174 13.0698L6.88974 13.7603L6.88985 13.7602L6.53174 13.0698ZM5.9126 13.0698L5.55448 13.7602L5.55448 13.7602L5.9126 13.0698ZM0.777832 6.22211L5.4121e-05 6.22209V6.22211H0.777832ZM6.22217 3.8891V3.11132H6.22209L6.22217 3.8891ZM3.88916 6.22211L3.11138 6.22209V6.22211H3.88916ZM6.22217 8.55511L6.22209 9.33289H6.22217V8.55511ZM8.55615 6.22211H9.33393V6.22209L8.55615 6.22211ZM6.22217 0.777771V1.55555C8.79945 1.55555 10.8887 3.64482 10.8887 6.22212L11.6665 6.22211L12.4443 6.22209C12.4442 2.78573 9.65859 -6.91414e-06 6.22217 -6.91414e-06V0.777771ZM11.6665 6.22211H10.8887C10.8887 7.89106 10.0393 9.26785 8.97929 10.3371C7.91999 11.4056 6.7154 12.0983 6.17362 12.3793L6.53174 13.0698L6.88985 13.7602C7.50147 13.443 8.86427 12.6626 10.084 11.4323C11.303 10.2027 12.4443 8.45475 12.4443 6.22211H11.6665ZM6.53174 13.0698L6.17374 12.3793C6.18444 12.3737 6.20139 12.3685 6.22213 12.3685C6.24288 12.3685 6.2599 12.3737 6.27071 12.3793L5.9126 13.0698L5.55448 13.7602C5.97575 13.9787 6.4687 13.9785 6.88974 13.7603L6.53174 13.0698ZM5.9126 13.0698L6.27072 12.3793C5.7289 12.0983 4.52431 11.4056 3.46501 10.3371C2.40499 9.2678 1.55561 7.89102 1.55561 6.22211H0.777832H5.4121e-05C5.4121e-05 8.45471 1.14131 10.2026 2.36031 11.4322C3.58002 12.6626 4.94282 13.4429 5.55448 13.7602L5.9126 13.0698ZM0.777832 6.22211L1.55561 6.22212C1.55566 3.64487 3.64493 1.5556 6.22218 1.55555L6.22217 0.777771L6.22215 -6.91414e-06C2.78581 5.99027e-05 0.000121176 2.78575 5.4121e-05 6.22209L0.777832 6.22211ZM6.22217 3.8891L6.22209 3.11132C4.50412 3.1115 3.11141 4.50392 3.11138 6.22209L3.88916 6.22211L4.66694 6.22212C4.66695 5.36317 5.36314 4.66697 6.22225 4.66688L6.22217 3.8891ZM3.88916 6.22211H3.11138C3.11138 7.94032 4.50412 9.33272 6.22209 9.33289L6.22217 8.55511L6.22225 7.77734C5.36311 7.77725 4.66694 7.08106 4.66694 6.22211H3.88916ZM6.22217 8.55511V9.33289C7.93996 9.33289 9.33393 7.94075 9.33393 6.22211H8.55615H7.77837C7.77837 7.08079 7.0817 7.77734 6.22217 7.77734V8.55511ZM8.55615 6.22211L9.33393 6.22209C9.3339 4.50349 7.93996 3.11132 6.22217 3.11132V3.8891V4.66688C7.08167 4.66688 7.77836 5.36343 7.77837 6.22212L8.55615 6.22211Z" fill="var(--color-secondary)"/>
          </svg>
          {{ step.place }}
        </div>
        <div class="popup__detail">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7.00002" cy="7.00002" r="6.3" stroke="var(--color-secondary)" stroke-width="1.4"/>
            <path d="M10.1501 7.00005H7.17512C7.07847 7.00005 7.00012 6.9217 7.00012 6.82505V4.55005" stroke="var(--color-secondary)" stroke-width="1.4" stroke-linecap="round"/>
          </svg>
          {{ datesFormated }}
        </div>
      </div>
    </Link>
  </div>
</template>
