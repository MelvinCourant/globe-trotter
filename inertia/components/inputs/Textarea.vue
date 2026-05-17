<script setup lang="ts">
import '../../assets/css/components/inputs/_textarea.scss'

defineProps({
  attributes: {
    type: Object,
    required: true,
  },
  dataInvalid: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <div class="textarea">
    <label
      v-if="label"
      :for="attributes.id"
      class="textarea__label"
    >
      {{ label }}
    </label>
    <textarea
      v-bind="attributes"
      :data-invalid="dataInvalid"
    />
  </div>
</template>
