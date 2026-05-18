<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/components/_map.scss'
import '../assets/css/components/_marker.scss'
import '../assets/css/components/_user-position.scss'
import { createApp, markRaw, onMounted, ref, useTemplateRef, watch } from "vue";
import Popup from "~/components/Popup.vue";

type Step = {
  id: string
  title: string
  startDate: string
  endDate: string
  medias: string[]
  place: string
  travelId: string
  latitude: string
  longitude: string
}

type Travel = {
  id: string
  title: string
  steps: Step[]
}

const props = defineProps<{
  highlightLocation: { latitude: number; longitude: number } | null,
  travels: Travel[],
  userCoordinates: { latitude: number; longitude: number } | null
}>()

const env = import.meta.env
const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer")
const mapInstance = ref<mapboxgl.Map | null>(null)
const userMarkerInstance = ref<mapboxgl.Marker | null>(null)
const markerInstance = ref<mapboxgl.Marker | null>(null)
const stepMarkers = ref<mapboxgl.Marker[]>([])
const theme = ref('light')

watch([() => props.userCoordinates, mapInstance], ([coords, map]) => {
  if (!map || !coords || (coords.latitude === 0 && coords.longitude === 0)) return

  if (!userMarkerInstance.value) {
    const userPositionMarker = document.createElement('div')
    userPositionMarker.className = 'user-position'

    userMarkerInstance.value = markRaw(new mapboxgl.Marker({ element: userPositionMarker })
      .setLngLat([coords.longitude, coords.latitude])
      .addTo(map))
    map.flyTo({ center: [coords.longitude, coords.latitude], speed: 2.5})
  } else {
    userMarkerInstance.value.setLngLat([coords.longitude, coords.latitude])
  }
})

watch([() => props.highlightLocation, mapInstance], ([coords, map]) => {
  if (!map) return

  if (!coords) {
    markerInstance.value?.remove()
    markerInstance.value = null
    return
  }

  if (coords.latitude === 0 && coords.longitude === 0) return

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

      markerInstance.value = markRaw(new mapboxgl.Marker({ anchor: 'bottom', element: markerEl })
        .setLngLat([coords.longitude, coords.latitude])
        .addTo(map))
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

watch([() => props.travels, mapInstance], ([travels, map]) => {
  if (!map) return

  let geojson = {
    type: 'FeatureCollection',
    features: []
  }

  for (const travel of travels) {
    for (const step of travel.steps) {
      const lat = Number(step.latitude)
      const lng = Number(step.longitude)
      if (!lat || !lng) return

      geojson.features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        properties: {
          dates: [step.startDate, step.endDate],
          medias: step.medias,
          place: step.place,
          travel,
          title: step.title,
        }
      })
    }
  }

  for (const [index, feature] of geojson.features.entries()) {
    const markerEl = document.createElement('div')
    markerEl.className = 'marker'
    markerEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="40" viewBox="0 0 36 40" fill="none"><path d="M17.6074 0C27.3318 0 35.2156 7.88308 35.2158 17.6074C35.2158 30.225 22.3401 37.8178 18.6094 39.7529C17.9733 40.0828 17.2425 40.0828 16.6064 39.7529C12.8761 37.818 0 30.2253 0 17.6074C0.000175233 7.88319 7.88319 0.000175244 17.6074 0Z" fill="var(--primary)"/></svg><span>${index + 1}</span>`

    let app: ReturnType<typeof createApp> | null = null
    const popup = new mapboxgl.Popup({ anchor: 'bottom', closeButton: false, offset: 48, maxWidth: 'none' })

    popup.on('open', () => {
      const container = document.createElement('div')
      app = createApp(Popup, {
        dates: feature.properties.dates,
        medias: feature.properties.medias,
        place: feature.properties.place,
        travel: feature.properties.travel,
        title: feature.properties.title,
      })
      app.mount(container)
      popup.setDOMContent(container)

      map.flyTo({ center: feature.geometry.coordinates})
    })

    popup.on('close', () => {
      app?.unmount()
      app = null
    })

    new mapboxgl.Marker({ anchor: 'bottom', element: markerEl })
      .setLngLat(feature.geometry.coordinates)
      .setPopup(popup)
      .addTo(map);
  }
}, { deep: true })

onMounted(() => {
  mapboxgl.accessToken = env.VITE_MAPBOX_ACCESSTOKEN

  if(window.matchMedia) {
    if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
  }

  mapInstance.value = markRaw(new mapboxgl.Map({
    container: mapContainer.value!,
    language: 'fr-FR',
    style: `mapbox://styles/mapbox/${theme.value}-v11`,
    zoom: 2
  }))
})
</script>

<template>
  <div class="map" ref="mapContainer"></div>
</template>
