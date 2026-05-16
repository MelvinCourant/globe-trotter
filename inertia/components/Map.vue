<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/components/_map.scss'
import '../assets/css/components/_user-position.scss'
import { onMounted, ref, useTemplateRef, watch } from "vue";

const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer")
const mapInstance = ref<mapboxgl.Map | null>(null)
const markerInstance = ref<mapboxgl.Marker | null>(null)
const theme = ref('light')
const userCoordinates = ref({
  latitude: 0,
  longitude: 0,
})

watch([userCoordinates, mapInstance], ([coords, map]) => {
  if (!map || (coords.latitude === 0 && coords.longitude === 0)) return

  if (!markerInstance.value) {
    const userPositionMarker = document.createElement('div')
    userPositionMarker.className = 'user-position'

    markerInstance.value = new mapboxgl.Marker({ element: userPositionMarker })
      .setLngLat([coords.longitude, coords.latitude])
      .addTo(map)
    map.flyTo({ center: [coords.longitude, coords.latitude]})
  } else {
    markerInstance.value.setLngLat([coords.longitude, coords.latitude])
  }
})

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN

  if(window.matchMedia) {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  function success(pos) {
    const coordinates = pos.coords;

    userCoordinates.value = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }
  }

  function error(err) {
    console.warn(`ERREUR (${err.code}): ${err.message}`);
  }

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error, options);
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
