<script setup lang="ts">
import '../assets/css/components/_account.scss'

defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="account">
    <img
      v-if="user.image"
      :src="`/uploads/${user.image}`"
      alt=""
      class="account__profile-picture"
    >
    <img
      v-else
      src="../assets/images/placeholder-small.png"
      alt="Profile picture placeholder"
      class="account__profile-picture"
    />
    <span class="account__firstname">{{ user.firstname }}</span>
  </div>
</template>
