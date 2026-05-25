<script setup lang="ts">
import '../assets/css/components/_settings.scss'
import ProfilePictureInput from "~/components/inputs/ProfilePictureInput.vue";
import Select from "~/components/inputs/Select.vue";
import { router } from '@inertiajs/vue3'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['close'])

const themeAttributes = {
  'name': 'theme',
  'id': 'theme',
}
const themeOptions = [
  { value: 'system', name: 'Système' },
  { value: 'light', name: 'Clair' },
  { value: 'dark', name: 'Sombre' },
  { value: 'auto', name: 'Auto (claire le jour, sombre la nuit)' },
].map(option => ({ ...option, selected: option.value === props.user.theme }))

function updateTheme(theme: string) {
  router.post('/users/update-theme', { theme }, { preserveState: true, preserveScroll: true })
}

function updateProfilePicture(image: File) {
  router.post('/users/update-profile-picture', { image }, { forceFormData: true, preserveState: true, preserveScroll: true })
}
</script>

<template>
  <div class="settings">
    <div class="settings__wrapper"
    >
      <h2 class="settings__title">Compte</h2>
      <div class="settings__container">
        <div class="settings__left">
          <ProfilePictureInput
            :image="`/uploads/${user.image}`"
            @update="updateProfilePicture"
          />
        </div>
        <div class="settings__right">
          <div class="settings__section">
            <div class="settings__row">
              <h3>Email</h3>
              <span>{{ user.email }}</span>
            </div>
            <div class="settings__row">
              <h3>Nom</h3>
              <span v-if="user.firstname || user.lastname">{{ user.firstname }} {{ user.lastname }}</span>
              <span v-else>Aucun nom renseigné</span>
            </div>
          </div>
          <div class="settings__section">
            <div class="settings__row">
              <h3>Thème</h3>
              <Select
                :attributes="themeAttributes"
                :options="themeOptions"
                @change="updateTheme"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="settings__overlay" @click="$emit('close')"></div>
  </div>
</template>
