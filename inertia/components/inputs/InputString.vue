<script setup>
import '../../assets/css/components/inputs/_input-string.scss'

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
    default: '',
  },
  style: {
    type: String,
    default: 'default',
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div :class="`input-string input-string--${style}`">
    <label
      v-if="label"
      :for="attributes.id"
      class="input-string__label"
    >
      {{ label }}
    </label>
    <input
      v-bind="attributes"
      :value="modelValue"
      :data-invalid="dataInvalid"
      class="input-string__input"
      @input="emit('update:modelValue', $event.target.value)"
    >
    <div
      v-if="error"
      class="input-string__error"
    >
      {{ error }}
    </div>
    <slot />
  </div>
</template>
