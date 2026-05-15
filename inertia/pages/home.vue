<script setup lang="ts">
import '../assets/css/pages/_home.scss'
import { Head, usePage} from '@inertiajs/vue3'
import Map from '../components/Map.vue'
import Button from "~/components/inputs/Button.vue";
import type {Data} from "@generated/data";

const page = usePage<Data.SharedProps>()
</script>

<template>
  <main class="home">
    <Head title="Ma carte" />
    <h1 class="hidden-title">Ma carte</h1>
    <Map/>
    <Button v-if="page.props.user" className="create-step" :iconOnly="true" :style="'primary'">
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
        <path d="M9.33334 1.33334L9.33334 17.3333" stroke="var(--white)" stroke-width="2.66667" stroke-linecap="round"/>
        <path d="M17.3333 9.33334L1.33334 9.33334" stroke="var(--white)" stroke-width="2.66667" stroke-linecap="round"/>
      </svg>
    </Button>
  </main>
</template>
