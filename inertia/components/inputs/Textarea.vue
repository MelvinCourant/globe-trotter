<script setup lang="ts">
import '../../assets/css/components/inputs/_textarea.scss'

defineProps({
  attributes: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  dataInvalid: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    required: true,
  }
})

const emit = defineEmits(['update:modelValue'])
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
      :value="modelValue"
      :data-invalid="dataInvalid"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <div
      v-if="error"
      class="textarea__error"
    >
      {{ error }}
    </div>
  </div>
</template>
