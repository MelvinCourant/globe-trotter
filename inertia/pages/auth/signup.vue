<script setup lang="ts">
import '../../assets/css/pages/auth/_login-signup.scss'
import {Form, Link} from "@adonisjs/inertia/vue";
import FormContainer from "~/components/FormContainer.vue";
import InputString from "~/components/inputs/InputString.vue";
import Button from "~/components/inputs/Button.vue";
import ProfilePictureInput from "~/components/inputs/ProfilePictureInput.vue";
import {Head} from "@inertiajs/vue3";

const emailAttributes = {
  'type': 'email',
  'name': 'email',
  'id': 'email',
  'autocomplete': 'email',
  'placeholder': 'john.doe@email.com',
};
const firstnameAttributes = {
  'type': 'text',
  'name': 'firstname',
  'id': 'firstname',
  'placeholder': 'John',
};
const lastnameAttributes = {
  'type': 'text',
  'name': 'lastname',
  'id': 'lastname',
  'placeholder': 'Doe',
};
const passwordAttributes = {
  'type': 'password',
  'name': 'password',
  'id': 'password',
  'autocomplete': 'new-password',
  'placeholder': '********'
}
const passwordConfirmationAttributes = {
  'type': 'password',
  'name': 'passwordConfirmation',
  'id': 'passwordConfirmation',
  'autocomplete': 'new-password',
  'placeholder': '********'
}
</script>

<template>
  <main class="login-signup">
    <Head title="Inscription" />
    <h1 class="hidden-title">Inscription</h1>
    <FormContainer
      size="medium"
      title="Inscription"
    >
      <Form
        v-slot="{ processing, errors }"
        route="new_account.store"
      >
        <ProfilePictureInput :error="errors.image" />
        <InputString
          :attributes="emailAttributes"
          :error="errors.email"
          label="Email*"
          :data-invalid="!!errors.email"
        />
        <div class="form-container__row">
          <InputString
            :attributes="firstnameAttributes"
            :error="errors.firstname"
            label="Prénom*"
            :data-invalid="!!errors.firstname"
          />
          <InputString
            :attributes="lastnameAttributes"
            :error="errors.lastname"
            label="Nom"
            :data-invalid="!!errors.lastname"
          />
        </div>
        <InputString
          :attributes="passwordAttributes"
          :data-invalid="!!errors.password"
          label="Mot de passe*"
          :error="errors.password"
        />
        <InputString
          :attributes="passwordConfirmationAttributes"
          :data-invalid="!!errors.passwordConfirmation"
          label="Confirmer le mot de passe*"
          :error="errors.passwordConfirmation"
        />
        <div class="form-container__bottom">
          <Button
            :disabled="processing"
            :style="'primary'"
            type="submit"
          >
            S'inscrire
          </Button>
          <p>
            Vous possédez déjà un compte ? <Link route="session.create">
              Se connecter
            </Link>
          </p>
        </div>
      </Form>
    </FormContainer>
  </main>
</template>
