<script setup>
import '../../assets/css/components/inputs/_button.scss'
import { Link } from '@adonisjs/inertia/vue'

defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  route: {
    type: String,
    default: '',
  },
  style: {
    type: String,
    default: 'default',
  },
  type: {
    type: String,
    default: ''
  },
})
</script>

<template>
  <button
    v-if="!route"
    :class="[`button button--${style}`, iconOnly && 'button--icon-only']"
    :type="type"
  >
    <slot />
  </button>
  <Link
    v-else
    :route="route"
    :class="[`button button--${style}`, iconOnly && 'button--icon-only']"
  >
    <slot />
  </Link>
</template>
