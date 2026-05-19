<script setup lang="ts">
import '../assets/css/pages/_home.scss'
import { Head, usePage, useForm } from '@inertiajs/vue3'
import Map from '../components/Map.vue'
import Button from "~/components/inputs/Button.vue";
import type {Data} from "@generated/data";
import FormContainer from "~/components/FormContainer.vue";
import {ref, onMounted, reactive, watch} from "vue";
import InputString from "~/components/inputs/InputString.vue";
import GalleryInput from "~/components/inputs/GalleryInput.vue";
import Combobox from "~/components/inputs/Combobox.vue";
import DatePicker from "~/components/inputs/DatePicker.vue";
import Textarea from "~/components/inputs/Textarea.vue";
import Search from "~/components/inputs/Search.vue";
import Step from "~/components/Step.vue";

const env = import.meta.env
const page = usePage<Data.SharedProps>()
const displayStepCreation = ref<boolean>(false)
const displayStepDetails = ref<boolean>(false)
const travelOptions = ref<{ value: string; text: string; display: boolean }[]>([]);
const locationOptions = ref<{ text: string; value: string }[]>([]);
const sessionToken = ref<string | null>(null);
const travels = ref([])
const selectedTravel = ref<Object | null>(null)
const previousStep = ref<string | null>(null)
const nextStep = ref<string | null>(null)
const selectedStep = ref<Object | null>(null)
const stepIndex = ref<Number | null>(1)
const totalSteps = ref<Number | null>(1)
const userCoordinates = ref<{ latitude: number; longitude: number } | null>(null);
const highlightLocation = ref<{ latitude: number; longitude: number } | null>(null);
const highlightStep = ref<string | null>(null);

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
const locationAttributes = reactive({
  'type': 'search',
  'name': 'location',
  'id': 'location',
  'placeholder': 'Mexico, Mexique',
  'value': '',
});
const descriptionAttributes = {
  'name': 'description',
  'id': 'description',
  'placeholder': 'Visite de la ville de Mexico accompagné d\'un guide local',
  'maxlength': 255
};
const linkAttributes = {
  'type': 'text',
  'name': 'link',
  'id': 'link',
  'placeholder': 'https://www.mesphotos.fr',
};
const form = useForm({
  travel_id: '',
  travel_title: '',
  title: '',
  start_date: null as string | null,
  end_date: null as string | null,
  latitude: null as number | null,
  longitude: null as number | null,
  place: '',
  description: '',
  link: '',
  medias: [] as File[],
})

onMounted(async () => {
  const geoOptions = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  navigator.geolocation?.getCurrentPosition(
    (pos) => {
      userCoordinates.value = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
    },
    (err) => console.warn(`ERREUR (${err.code}): ${err.message}`),
    geoOptions
  );

  if(page.props.user) {
    const response = await fetch('/travels');
    travels.value = await response.json();

    travelOptions.value = travels.value.map((travel: { id: string; title: string }) => ({
      value: travel.id,
      text: travel.title,
      display: true,
    }));
  }

  const params = new URLSearchParams(window.location.search)

  if(params && params.get('step')) {
    displayStep(params.get('step'))
  }
});

watch(() => page.url, (newUrl) => {
  const params = new URLSearchParams(newUrl.split('?')[1] ?? '')

  if(params && params.get('step')) {
    displayStep(params.get('step'))
  }
})

async function displayStepForm() {
  if (!displayStepCreation.value) {
    displayStepCreation.value = true;

    sessionToken.value = crypto.randomUUID();

    if(userCoordinates.value) {
      await findActualLocation()
      highlightLocation.value = userCoordinates.value;
    }
  }
}

function updateTravel(chips: Array<{ text: string, value: string }>) {
  form.travel_id = chips[0]?.value ?? ''
  form.travel_title = chips[0]?.text ?? ''
}

function toDateString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function updateDates(dates: [Date, Date] | null) {
  form.start_date = dates?.[0] ? toDateString(dates[0]) : null
  form.end_date = dates?.[1] ? toDateString(dates[1]) : null
}

function updateMedias(files: File[]) {
  form.medias = files
}

async function suggestLocation(searchText: string) {
  locationAttributes.value = searchText;

  if(searchText) {
    const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${env.VITE_MAPBOX_ACCESSTOKEN}&session_token=${sessionToken.value}&language=fr&limit=10&types=country%2Cregion%2Cpostcode%2Clocality%2Cplace%2Cstreet%2Cdistrict%2Cneighborhood`)
    const json = await response.json();

    locationOptions.value = []

    if(json.suggestions && json.suggestions.length > 0){
      json.suggestions.forEach((suggestion: { mapbox_id: string; name: string, place_formatted: string }) => {
        const suggestionText = suggestion.place_formatted
          ? `${suggestion.name}, ${suggestion.place_formatted}`
          : suggestion.name;

        locationOptions.value.push({
          text: suggestionText,
          value: suggestion.mapbox_id,
        })
      })
    }
  }
}

async function findActualLocation() {
  if (!userCoordinates.value) return;

  const coords = userCoordinates.value;
  const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/reverse?longitude=${coords.longitude}&latitude=${coords.latitude}&access_token=${env.VITE_MAPBOX_ACCESSTOKEN}&language=fr&limit=1&types=country%2Cregion%2Cpostcode%2Clocality%2Cplace%2Cstreet%2Cdistrict%2Cneighborhood`)
  const json = await response.json();

  if(json.features && json.features.length > 0) {
    locationAttributes.value = json.features[0].properties.place_formatted;
    highlightLocation.value = coords;
    form.latitude = parseFloat(coords.latitude.toFixed(7));
    form.longitude = parseFloat(coords.longitude.toFixed(7));
    form.place = locationAttributes.value;
  }
}

async function createStep() {
  form.post('/steps', {
    forceFormData: true,
    onSuccess: async () => {
      travels.value = await fetch('/travels').then(r => r.json())
      travelOptions.value = travels.value.map((travel: { id: string; title: string }) => ({
        value: travel.id,
        text: travel.title,
        display: true,
      }));
      form.reset()
      locationAttributes.value = ''
      displayStepCreation.value = false
      highlightLocation.value = null
    }
  })
}

async function retrieveLocation(locationSelected: {value: string, text: string}) {
  locationAttributes.value = locationSelected.text;

  const response = await fetch(`https://api.mapbox.com/search/searchbox/v1/retrieve/${locationSelected.value}?session_token=${sessionToken.value}&access_token=${env.VITE_MAPBOX_ACCESSTOKEN}&language=fr`)
  const json = await response.json();

  if(json.features && json.features.length > 0) {
    if(json.features[0].properties.place_formatted) {
      locationAttributes.value = `${json.features[0].properties.name}, ${json.features[0].properties.place_formatted}`;
    } else {
      locationAttributes.value = json.features[0].properties.name
    }

    highlightLocation.value = {
      latitude: json.features[0].geometry.coordinates[1],
      longitude: json.features[0].geometry.coordinates[0],
    }
    form.latitude = parseFloat(json.features[0].geometry.coordinates[1].toFixed(7));
    form.longitude = parseFloat(json.features[0].geometry.coordinates[0].toFixed(7));
    form.place = locationAttributes.value;
  }
}

function cancelStepCreation() {
  form.reset()
  displayStepCreation.value = false
  highlightLocation.value = null
}

function displayStep(stepId: string) {
  const travel = travels.value.find((t) => t.steps?.some((s) => String(s.id) === String(stepId)))

  if (travel) {
    const index = travel.steps.findIndex((s) => String(s.id) === String(stepId))

    selectedTravel.value = { id: travel.id, title: travel.title }
    selectedStep.value = travel.steps[index]
    previousStep.value = index > 0 ? travel.steps[index - 1].id : null
    nextStep.value = index < travel.steps.length - 1 ? travel.steps[index + 1].id : null
    stepIndex.value = index + 1
    totalSteps.value = travel.steps.length

    displayStepDetails.value = true
    highlightStep.value = stepId
  }
}
</script>

<template>
  <main class="home">
    <Head title="Ma carte" />
    <h1 class="hidden-title">Ma carte</h1>
    <Map
      :disablePopups="displayStepDetails"
      :travels="travels"
      :highlightLocation="highlightLocation"
      :highlightStep="highlightStep"
      :userCoordinates="userCoordinates"
    />
    <Button v-if="page.props.user" v-show="!displayStepCreation" className="create-step" :iconOnly="true" :style="'primary'" @click="displayStepForm">
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
      <form @submit.prevent="createStep">
        <GalleryInput @updateMedias="updateMedias"/>
        <Combobox
          label="Voyage*"
          :options="travelOptions"
          :attributes="travelAttributes"
          :chipsMax="1"
          :customEntry="true"
          :data-invalid="!!form.errors.travel_id"
          :error="form.errors.travel_id"
          @updateChips="updateTravel"
        />
        <InputString
          v-model="form.title"
          :attributes="titleAttributes"
          :error="form.errors.title"
          label="Titre*"
          :data-invalid="!!form.errors.title"
        />
        <DatePicker
          label="Date de début et de fin*"
          :attributes="datesAttributes"
          :error="form.errors.start_date || form.errors.end_date"
          @updateDates="updateDates"
        />
        <Search
          label="Localisation*"
          :attributes="locationAttributes"
          :options="locationOptions"
          :data-invalid="!!form.errors.longitude || !!form.errors.latitude || !!form.errors.place"
          :error="form.errors.longitude || form.errors.latitude || form.errors.place"
          @search="suggestLocation"
          @updateValue="retrieveLocation"
        >
          <button class="icon-button" @click="findActualLocation" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="8.88889" cy="8.88872" r="6.22222" stroke="var(--color)" stroke-width="1.77778"/>
              <circle cx="8.88891" cy="8.8891" r="1.77778" fill="var(--color)" stroke="var(--color)" stroke-width="1.77778"/>
              <path d="M8.8889 2.66669V0.888916" stroke="var(--color)" stroke-width="1.77778" stroke-linecap="round"/>
              <path d="M15.1111 8.88892L16.8889 8.88892" stroke="var(--color)" stroke-width="1.77778" stroke-linecap="round"/>
              <path d="M8.8889 16.8891L8.8889 15.1113" stroke="var(--color)" stroke-width="1.77778" stroke-linecap="round"/>
              <path d="M0.888895 8.88892H2.66667" stroke="var(--color)" stroke-width="1.77778" stroke-linecap="round"/>
            </svg>
          </button>
        </Search>
        <Textarea v-model="form.description" label="Description" :attributes="descriptionAttributes"/>
        <InputString
          v-model="form.link"
          :attributes="linkAttributes"
          :error="form.errors.link"
          label="Lien"
          :data-invalid="!!form.errors.link"
        />
        <div class="form-container__actions">
          <Button
            :disabled="form.processing"
            :style="'primary'"
            type="submit"
          >Ajouter l'étape</Button>
          <Button :disabled="form.processing" type="button" @click="cancelStepCreation">Annuler</Button>
        </div>
      </form>
    </FormContainer>
    <Step
      v-if="displayStepDetails"
      :nextStep="nextStep"
      :previousStep="previousStep"
      :step="selectedStep"
      :stepIndex="stepIndex"
      :totalSteps="totalSteps"
      :travel="selectedTravel"
    />
  </main>
</template>
