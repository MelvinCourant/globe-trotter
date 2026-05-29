<script setup lang="ts">
import '../../assets/css/components/inputs/_date-picker.scss'
import { VueDatePicker } from "@vuepic/vue-datepicker"
import {onMounted, ref, watch } from 'vue';
import { fr } from "date-fns/locale"
import '@vuepic/vue-datepicker/dist/main.css'

const props = defineProps({
  attributes: {
    type: Object,
    required: true
  },
  dataInvalid: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  initialDates: {
    type: Array as () => [Date, Date] | null,
    default: null,
  },
  label: {
    type: String,
    default: '',
  }
})

const emit = defineEmits<{ updateDates: [dates: [Date, Date] | null] }>()
const dates = ref<[Date, Date] | null>(null)
const isMobile = ref(false)

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

watch(() => props.initialDates, (value) => { dates.value = value }, { immediate: true })
watch(dates, (value) => emit('updateDates', value))
</script>

<template>
  <div class="date-picker">
    <label
      v-if="label"
      class="date-picker__label"
    >
      {{ label }}
    </label>
    <VueDatePicker
      v-model="dates"
      v-bind="attributes"
      :action-row="{selectBtnLabel: 'Sélectionner', cancelBtnLabel: 'Annuler'}"
      :multi-calendars="!isMobile"
      :formats="{ input: 'dd/MM/yyyy'}"
      :locale="fr"
      :time-config="{ enableTimePicker: false }"
      :teleport="true"
    />
    <div
        v-if="error"
        class="date-picker__error"
    >
      {{ error }}
    </div>
  </div>
</template>
