<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/components/_map.scss'
import '../assets/css/components/_user-position.scss'
import { onMounted, ref, useTemplateRef, watch } from "vue";

const props = defineProps<{
  highlightLocation: { latitude: number; longitude: number } | null,
  userCoordinates: { latitude: number; longitude: number } | null
}>()

const env = import.meta.env
const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer")
const mapInstance = ref<mapboxgl.Map | null>(null)
const userMarkerInstance = ref<mapboxgl.Marker | null>(null)
const markerInstance = ref<mapboxgl.Marker | null>(null)
const theme = ref('light')

watch([() => props.userCoordinates, mapInstance], ([coords, map]) => {
  if (!map || !coords || (coords.latitude === 0 && coords.longitude === 0)) return

  if (!userMarkerInstance.value) {
    const userPositionMarker = document.createElement('div')
    userPositionMarker.className = 'user-position'

    userMarkerInstance.value = new mapboxgl.Marker({ element: userPositionMarker })
      .setLngLat([coords.longitude, coords.latitude])
      .addTo(map)
    map.flyTo({ center: [coords.longitude, coords.latitude], speed: 2.5})
  } else {
    userMarkerInstance.value.setLngLat([coords.longitude, coords.latitude])
  }
})

watch([() => props.highlightLocation, mapInstance], ([coords, map]) => {
  if (!map || !coords || (coords.latitude === 0 && coords.longitude === 0)) return

  if (!markerInstance.value) {
    if(
      (props.userCoordinates &&
      coords.latitude !== props.userCoordinates.latitude &&
      coords.longitude !== props.userCoordinates.longitude) ||
      !props.userCoordinates
    ) {
      const markerEl = document.createElement('div')
      markerEl.className = 'marker'
      markerEl.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="40" viewBox="0 0 36 40" fill="none"><path d="M17.6074 0C27.3318 0 35.2156 7.88308 35.2158 17.6074C35.2158 30.225 22.3401 37.8178 18.6094 39.7529C17.9733 40.0828 17.2425 40.0828 16.6064 39.7529C12.8761 37.818 0 30.2253 0 17.6074C0.000175233 7.88319 7.88319 0.000175244 17.6074 0Z" fill="var(--primary)"/></svg>'

      markerInstance.value = new mapboxgl.Marker({ element: markerEl })
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(map)
    }
  } else {
    if(
      (props.userCoordinates &&
        coords.latitude !== props.userCoordinates.latitude &&
        coords.longitude !== props.userCoordinates.longitude) ||
      !props.userCoordinates
    ) {
      markerInstance.value.setLngLat([coords.longitude, coords.latitude])
    } else {
      markerInstance.value.remove()
      markerInstance.value = null
    }
  }

  map.flyTo({center: [coords.longitude, coords.latitude], speed: 2.5, zoom: 11})
})

onMounted(() => {
  mapboxgl.accessToken = env.VITE_MAPBOX_ACCESSTOKEN

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
