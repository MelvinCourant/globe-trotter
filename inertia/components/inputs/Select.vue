<script setup>
import '../../assets/css/components/inputs/_select.scss'

defineProps({
  attributes: {
    type: Object,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  }
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="select">
    <label
      v-if="label"
      :for="attributes.id"
      class="select__label"
    >
      {{ label }}
    </label>
    <select
      v-bind="attributes"
      class="select__input"
      @change="emit('change', $event.target.value)"
    >
      <option
        v-for="option in options"
        :value="option.value"
        :selected="option.selected"
        >{{ option.text }}</option>
    </select>
  </div>
</template>
