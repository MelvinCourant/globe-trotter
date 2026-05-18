<script setup lang="ts">
import '../assets/css/components/_step.scss'
import MediasSlider from "~/components/MediasSlider.vue";
import Chip from "~/components/Chip.vue";
import {computed} from "vue";

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
  <div class="step">
    <MediasSlider :medias="step.medias"/>
    <div class="step__content">
      <Chip :text="travel.title"/>
      <div class="step__title-update">
        <h2 class="step__title">
          {{ step.title }}
        </h2>
        <button
          class="step__update"
          title="Modifier l'étape"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M13.9211 4.97168C14.3104 5.0132 14.6208 5.19171 14.8674 5.37988C15.1281 5.57873 15.4073 5.86121 15.6946 6.14844L15.8518 6.30566C16.139 6.59283 16.4206 6.87225 16.6194 7.13281C16.8344 7.41459 17.0374 7.77914 17.0374 8.25C17.0374 8.72086 16.8344 9.08541 16.6194 9.36719C16.4206 9.62776 16.139 9.90717 15.8518 10.1943L9.25708 16.7891C9.11312 16.933 8.92643 17.1307 8.68481 17.2676C8.44311 17.4044 8.17732 17.4633 7.97974 17.5127L5.54712 18.1211C5.41154 18.155 5.20768 18.2082 5.02954 18.2256C4.83997 18.2441 4.42599 18.2498 4.08813 17.9121C3.75009 17.5741 3.75612 17.1592 3.77466 16.9697C3.79212 16.7917 3.84528 16.5886 3.87915 16.4531L4.48755 14.0205C4.53695 13.8229 4.5958 13.5572 4.73267 13.3154L4.84497 13.1445C4.96505 12.9832 5.10317 12.8512 5.21118 12.7432L5.21704 12.7363L11.8049 6.14844C12.0921 5.86126 12.3715 5.57873 12.6321 5.37988C12.9139 5.16489 13.2794 4.96289 13.7502 4.96289L13.9211 4.97168Z" stroke="var(--color)" stroke-width="1.83333"/>
            <path d="M11.4583 6.87502L14.2083 5.04169L16.9583 7.79169L15.1249 10.5417L11.4583 6.87502Z" fill="var(--color)"/>
          </svg>
        </button>
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
  </div>
</template>
