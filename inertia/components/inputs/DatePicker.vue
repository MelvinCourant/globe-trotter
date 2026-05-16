<script setup lang="ts">
import '../../assets/css/components/inputs/_date-picker.scss'
import { VueDatePicker } from "@vuepic/vue-datepicker"
import { ref } from 'vue';
import { fr } from "date-fns/locale"
import '@vuepic/vue-datepicker/dist/main.css'

defineProps({
  attributes: {
    type: Object,
    required: true
  },
  label: {
    type: String,
    default: '',
  }
})

const dates = ref();
</script>

<template>
  <div class="date-picker">
    <label class="date-picker__label">
      {{ label }}
    </label>
    <VueDatePicker
      v-model="dates"
      v-bind="attributes"
      :formats="{ input: 'dd/MM/yyyy'}"
      :locale="fr"
      :time-config="{ enableTimePicker: false }"
    />
  </div>
</template>
