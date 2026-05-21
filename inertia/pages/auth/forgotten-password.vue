<script setup lang="ts">
import '../../assets/css/pages/auth/_login-signup.scss'
import { Form, Link } from '@adonisjs/inertia/vue'
import FormContainer from '~/components/FormContainer.vue'
import InputString from '~/components/inputs/InputString.vue'
import Button from '~/components/inputs/Button.vue'
import { Head } from '@inertiajs/vue3'

defineProps<{ sent?: boolean; error?: string }>()

const emailAttributes = {
  type: 'email',
  name: 'email',
  id: 'email',
  autocomplete: 'email',
  placeholder: 'john.doe@email.com',
}
</script>

<template>
  <main class="login-signup">
    <Head title="Mot de passe oublié" />
    <h1 class="hidden-title">Mot de passe oublié</h1>
    <FormContainer size="medium" title="Mot de passe oublié">
      <template v-if="sent">
        <p>Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation dans quelques minutes.</p>
        <div class="form-container__bottom">
          <Link route="session.create">Retour à la connexion</Link>
        </div>
      </template>
      <Form v-else v-slot="{ processing, errors }" route="forgotten_password.store">
        <p v-if="error" class="form-error">{{ error }}</p>
        <InputString
          :attributes="emailAttributes"
          :error="errors.email"
          label="Email*"
          :data-invalid="!!errors.email"
        />
        <div class="form-container__bottom">
          <Button :disabled="processing" :style="'primary'" type="submit">
            Envoyer le lien
          </Button>
          <p>
            <Link route="session.create">Retour à la connexion</Link>
          </p>
        </div>
      </Form>
    </FormContainer>
  </main>
</template>