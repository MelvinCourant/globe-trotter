<script setup lang="ts">
import '../assets/css/pages/_home.scss'
import { Head, usePage} from '@inertiajs/vue3'
import Map from '../components/Map.vue'
import Button from "~/components/inputs/Button.vue";
import type {Data} from "@generated/data";
import FormContainer from "~/components/FormContainer.vue";
import {ref, onMounted} from "vue";
import {Form} from "@adonisjs/inertia/vue";
import InputString from "~/components/inputs/InputString.vue";
import GalleryInput from "~/components/inputs/GalleryInput.vue";
import Combobox from "~/components/inputs/Combobox.vue";

const page = usePage<Data.SharedProps>()
const displayStepCreation = ref<boolean>(false)
const travelOptions = ref([]);

onMounted(async () => {
  if (!page.props.user) return;

  const response = await fetch('/travels');
  const travels = await response.json();
  travelOptions.value = travels.map((travel: { id: string; title: string }) => ({
    value: travel.id,
    text: travel.title,
    display: true,
  }));
});
const travelAttributes = {
  'type': 'text',
  'name': 'travel',
  'id': 'travel',
  'placeholder': 'Road trip en Amérique du Sud',
};
const linkAttributes = {
  'type': 'text',
  'name': 'link',
  'id': 'link',
  'placeholder': 'https://www.mesphotos.fr',
};
const travel = ref({})

function displayStepForm() {
  if (!displayStepCreation.value) {
    displayStepCreation.value = true;
  }
}

function updateTravel(travelValue: object) {
  travel.value = travelValue
}
</script>

<template>
  <main class="home">
    <Head title="Ma carte" />
    <h1 class="hidden-title">Ma carte</h1>
    <Map/>
    <Button v-if="page.props.user" className="create-step" :iconOnly="true" :style="'primary'" @click="displayStepForm">
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <path d="M9.33334 1.33334L9.33334 17.3333" stroke="var(--white)" stroke-width="2.66667" stroke-linecap="round"/>
        <path d="M17.3333 9.33334L1.33334 9.33334" stroke="var(--white)" stroke-width="2.66667" stroke-linecap="round"/>
      </svg>
    </Button>
    <FormContainer
      v-if="displayStepCreation && page.props.user"
      className="step-form"
      size="large"
      title="Ajouter une étape"
    >
      <Form
        v-slot="{ processing, errors }"
        route="steps.create"
      >
        <GalleryInput/>
        <Combobox
          label="Voyage*"
          :options="travelOptions"
          :attributes="travelAttributes"
          :chipsMax="1"
          :customEntry="true"
          @updateChips="updateTravel"
        />
        <InputString
          :attributes="linkAttributes"
          :error="errors.link"
          label="Lien"
          :data-invalid="!!errors.link"
        />
      </Form>
    </FormContainer>
  </main>
</template>
