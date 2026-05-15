<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/components/_map.scss'
import { onMounted, ref, useTemplateRef } from "vue";

const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer")
const mapInstance = ref<mapboxgl.Map | null>(null)
const theme = ref('light')

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN

  if(window.matchMedia) {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
  }

  mapInstance.value = new mapboxgl.Map({
    container: mapContainer.value!,
    style: `mapbox://styles/mapbox/${theme.value}-v11`,
    zoom: 2
  })
})
</script>

<template>
  <div class="map" ref="mapContainer"></div>
</template>
