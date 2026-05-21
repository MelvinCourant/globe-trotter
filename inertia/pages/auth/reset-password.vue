<script setup lang="ts">
import '../../assets/css/pages/auth/_login-signup.scss'
import { useForm } from '@inertiajs/vue3'
import FormContainer from '~/components/FormContainer.vue'
import InputString from '~/components/inputs/InputString.vue'
import Button from '~/components/inputs/Button.vue'
import { Head } from '@inertiajs/vue3'

const props = defineProps<{ token: string }>()

const form = useForm({ password: '', passwordConfirmation: '' })

function submit() {
  form.post(`/reset-password/${props.token}`)
}

const passwordAttributes = {
  type: 'password',
  name: 'password',
  id: 'password',
  autocomplete: 'new-password',
  placeholder: '********',
}

const passwordConfirmationAttributes = {
  type: 'password',
  name: 'passwordConfirmation',
  id: 'passwordConfirmation',
  autocomplete: 'new-password',
  placeholder: '********',
}
</script>

<template>
  <main class="login-signup">
    <Head title="Réinitialiser le mot de passe" />
    <h1 class="hidden-title">Réinitialiser le mot de passe</h1>
    <FormContainer size="medium" title="Nouveau mot de passe">
      <form @submit.prevent="submit">
        <InputString
          :attributes="passwordAttributes"
          v-model="form.password"
          :error="form.errors.password"
          label="Nouveau mot de passe*"
          :data-invalid="!!form.errors.password"
        />
        <InputString
          :attributes="passwordConfirmationAttributes"
          v-model="form.passwordConfirmation"
          :error="form.errors.passwordConfirmation"
          label="Confirmer le mot de passe*"
          :data-invalid="!!form.errors.passwordConfirmation"
        />
        <div class="form-container__bottom">
          <Button :disabled="form.processing" :style="'primary'" type="submit">
            Réinitialiser le mot de passe
          </Button>
        </div>
      </form>
    </FormContainer>
  </main>
</template>