<script setup lang="ts">
import '../assets/css/components/_account.scss'
import Settings from "~/components/Settings.vue";
import {ref} from "vue";

defineProps({
  user: {
    type: Object,
    required: true
  }
})

const settingsOpen = ref(false)
</script>

<template>
  <button
    class="account"
    title="Paramètres du compte"
    @click="settingsOpen = !settingsOpen"
  >
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
  </button>
  <Teleport to="body">
    <Settings
      v-if="settingsOpen"
      :user="user"
      @close="settingsOpen = false"
    />
  </Teleport>
</template>
