<script setup lang="ts">
import '../../assets/css/pages/auth/_login-signup.scss'
import {Form, Link} from '@adonisjs/inertia/vue'
import FormContainer from "~/components/FormContainer.vue";
import InputString from "~/components/inputs/InputString.vue";
import Button from "~/components/inputs/Button.vue";
import {Head} from "@inertiajs/vue3";

const emailAttributes = {
  'type': 'email',
  'name': 'email',
  'id': 'email',
  'autocomplete': 'username',
  'placeholder': 'john.doe@email.com',
};
const passwordAttributes = {
  'type': 'password',
  'name': 'password',
  'id': 'password',
  'autocomplete': 'current-password',
  'placeholder': '********',
}
</script>

<template>
  <main class="login-signup">
    <Head title="Connexion" />
    <h1 class="hidden-title">Connexion</h1>
    <FormContainer
      size="medium"
      title="Connexion"
    >
      <Form
        v-slot="{ processing, errors }"
        route="session.store"
      >
        <InputString
          :attributes="emailAttributes"
          :error="errors.email"
          label="Email*"
          :data-invalid="!!errors.email"
        />
        <InputString
          :attributes="passwordAttributes"
          :data-invalid="!!errors.password"
          label="Mot de passe*"
          :error="errors.password"
        >
          <a href="#">Mot de passe oublié ?</a>
        </InputString>
        <div class="form-container__bottom">
          <Button
            :disabled="processing"
            :style="'primary'"
            type="submit"
          >
            Se connecter
          </Button>
          <p>
            Vous n'avez pas de compte ? <Link route="new_account.create">
              S'inscrire
            </Link>
          </p>
        </div>
      </Form>
    </FormContainer>
  </main>
</template>
