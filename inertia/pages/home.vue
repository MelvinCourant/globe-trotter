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
import DatePicker from "~/components/inputs/DatePicker.vue";
import Textarea from "~/components/inputs/Textarea.vue";
import Search from "~/components/inputs/Search.vue";

const env = import.meta.env
const page = usePage<Data.SharedProps>()
const displayStepCreation = ref<boolean>(false)
const travelOptions = ref([]);
const locationOptions = ref([]);
const sessionToken = ref<string | null>(null);

onMounted(async () => {
  if (!page.props.user) return;

  const response = await fetch('/travels');
  const travels = await response.json();
  travelOptions.value = travels.map((travel: { id: string; title: string }) => ({
    value: travel.id,
    text: travel.title,
    display: true,
  }));

  sessionToken.value = crypto.randomUUID();
});
const travelAttributes = {
  'type': 'text',
  'name': 'travel',
  'id': 'travel',
  'placeholder': 'Road trip en Amérique du Sud',
};
const titleAttributes = {
  'type': 'text',
  'name': 'title',
  'id': 'title',
  'placeholder': 'Visite de Mexico',
  'maxlength': 100
};
const datesAttributes = {
  'placeholder': 'Sélectionner les dates',
  'range': true,
  'multi-calendars': true,
  'text-input': true
};
const locationAttributes = {
  'type': 'search',
  'name': 'location',
  'id': 'location',
  'placeholder': 'Manaus, Amazonas, Brésil',
};
const descriptionAttributes = {
  'name': 'description',
  'id': 'description',
  'placeholder': 'Visite du Musée du Louvres, de la Tour Eiffel et de Notre-Dame de Paris',
  'maxlength': 255
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

async function suggestLocation(searchText: string) {
  const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${env.VITE_MAPBOX_ACCESSTOKEN}&session_token=${sessionToken.value}&language=fr&limit=10&types=country%2Cregion%2Cpostcode%2Clocality%2Cplace%2Cstreet%2Cdistrict%2Cneighborhood`)
  const json = await response.json();

  locationOptions.value = []

  if(json.suggestions.length > 0){
    json.suggestions.forEach((suggestion: { mapbox_id: string; name: string, place_formatted: string }) => {
      locationOptions.value.push({
        text: `${suggestion.name}, ${suggestion.place_formatted}`,
        value: suggestion.mapbox_id,
      })
    })
  }
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
          :attributes="titleAttributes"
          :error="errors.title"
          label="Titre*"
          :data-invalid="!!errors.title"
        />
        <DatePicker
          label="Date de début et de fin*"
          :attributes="datesAttributes"
        />
        <Search
          :attributes="locationAttributes"
          :options="locationOptions"
          @search="suggestLocation"
        />
        <Textarea label="Description" :attributes="descriptionAttributes"/>
        <InputString
          :attributes="linkAttributes"
          :error="errors.link"
          label="Lien"
          :data-invalid="!!errors.link"
        />
        <div class="form-container__actions">
          <Button :style="'primary'" type="submit">Ajouter l'étape</Button>
          <Button>Annuler</Button>
        </div>
      </Form>
    </FormContainer>
  </main>
</template>
