<script setup lang="ts">
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../assets/css/components/_map.scss'
import '../assets/css/components/_marker.scss'
import '../assets/css/components/_user-position.scss'
import { createApp, markRaw, onMounted, ref, useTemplateRef, watch } from "vue";
import Popup from "~/components/Popup.vue";
import Cluster from "~/components/Cluster.vue";

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

type Feature = {
  type: string
  geometry: { type: string; coordinates: [number, number] }
  properties: {
    step: { id: string; title: string; startDate: string; endDate: string; medias: string[]; place: string }
    stepIndex: number
    travel: Travel
  }
}

const props = defineProps<{
  highlightLocation: { latitude: number; longitude: number } | null,
  travels: Travel[],
  userCoordinates: { latitude: number; longitude: number } | null
}>()

const env = import.meta.env
const CLUSTER_ZOOM_THRESHOLD = 4
const PROXIMITY_PIXEL_THRESHOLD = 40
const mapContainer = useTemplateRef<HTMLDivElement>("mapContainer")
const mapInstance = ref<mapboxgl.Map | null>(null)
const userMarkerInstance = ref<mapboxgl.Marker | null>(null)
const markerInstance = ref<mapboxgl.Marker | null>(null)
const stepMarkers = ref<mapboxgl.Marker[]>([])
const travelClusterMarkers = ref<mapboxgl.Marker[]>([])
const proximityClusterMarkers = ref<mapboxgl.Marker[]>([])
const zoomHandler = ref<(() => void) | null>(null)
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

  stepMarkers.value.forEach(m => m.remove())
  stepMarkers.value = []
  travelClusterMarkers.value.forEach(m => m.remove())
  travelClusterMarkers.value = []
  proximityClusterMarkers.value.forEach(m => m.remove())
  proximityClusterMarkers.value = []

  if (zoomHandler.value) {
    map.off('zoom', zoomHandler.value)
    zoomHandler.value = null
  }

  const geojson: { type: string; features: Feature[] } = {
    type: 'FeatureCollection',
    features: []
  }

  for (const travel of travels) {
    for (const [index, step] of travel.steps.entries()) {
      const lat = Number(step.latitude)
      const lng = Number(step.longitude)
      if (!lat || !lng) continue

      geojson.features.push({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {
          step: {
            endDate: step.endDate,
            id: step.id,
            medias: step.medias,
            place: step.place,
            startDate: step.startDate,
            title: step.title,
          },
          stepIndex: index,
          travel,
        }
      })
    }
  }

  const travelGroups = new Map<string, { title: string; features: Feature[] }>()
  for (const feature of geojson.features) {
    const { id, title } = feature.properties.travel
    if (!travelGroups.has(id)) travelGroups.set(id, { title, features: [] })
    travelGroups.get(id)!.features.push(feature)
  }

  for (const [, { title, features }] of travelGroups) {
    const centerLng = features.reduce((s, f) => s + f.geometry.coordinates[0], 0) / features.length
    const centerLat = features.reduce((s, f) => s + f.geometry.coordinates[1], 0) / features.length

    const bounds = new mapboxgl.LngLatBounds()
    features.forEach(f => bounds.extend(f.geometry.coordinates))

    const clusterEl = document.createElement('div')
    createApp(Cluster, { text: title }).mount(clusterEl)
    clusterEl.style.cursor = 'pointer'
    clusterEl.addEventListener('click', () => map.fitBounds(bounds, { padding: 140, maxZoom: 10, speed: 2.5 }))

    travelClusterMarkers.value.push(
      markRaw(new mapboxgl.Marker({ element: clusterEl, anchor: 'center' })
        .setLngLat([centerLng, centerLat])
        .addTo(map))
    )
  }

  for (const feature of geojson.features) {
    const markerEl = document.createElement('div')
    markerEl.className = 'marker'
    markerEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="40" viewBox="0 0 36 40" fill="none"><path d="M17.6074 0C27.3318 0 35.2156 7.88308 35.2158 17.6074C35.2158 30.225 22.3401 37.8178 18.6094 39.7529C17.9733 40.0828 17.2425 40.0828 16.6064 39.7529C12.8761 37.818 0 30.2253 0 17.6074C0.000175233 7.88319 7.88319 0.000175244 17.6074 0Z" fill="var(--primary)"/></svg><span>${feature.properties.stepIndex + 1}</span>`

    let app: ReturnType<typeof createApp> | null = null
    const popup = new mapboxgl.Popup({ anchor: 'bottom', closeButton: false, offset: 48, maxWidth: 'none' })

    popup.on('open', () => {
      const container = document.createElement('div')
      app = createApp(Popup, {
        step: feature.properties.step,
        travel: feature.properties.travel,
      })
      app.mount(container)
      popup.setDOMContent(container)

      map.flyTo({ center: feature.geometry.coordinates})
    })

    popup.on('close', () => {
      app?.unmount()
      app = null
    })

    stepMarkers.value.push(
      markRaw(new mapboxgl.Marker({ anchor: 'bottom', element: markerEl })
        .setLngLat(feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map))
    )
  }

  const updateProximityClusters = () => {
    proximityClusterMarkers.value.forEach(m => m.remove())
    proximityClusterMarkers.value = []

    const n = geojson.features.length
    const assigned = new Array(n).fill(false)

    for (let i = 0; i < n; i++) {
      if (assigned[i]) continue
      const group = [i]
      assigned[i] = true
      const pi = map.project(geojson.features[i].geometry.coordinates as [number, number])

      for (let j = i + 1; j < n; j++) {
        if (assigned[j]) continue
        const pj = map.project(geojson.features[j].geometry.coordinates as [number, number])
        const dx = pi.x - pj.x
        const dy = pi.y - pj.y
        if (Math.sqrt(dx * dx + dy * dy) < PROXIMITY_PIXEL_THRESHOLD) {
          group.push(j)
          assigned[j] = true
        }
      }

      if (group.length > 1) {
        group.forEach(idx => {
          stepMarkers.value[idx].getElement().style.display = 'none'
        })

        const centerLng = group.reduce((s, idx) => s + geojson.features[idx].geometry.coordinates[0], 0) / group.length
        const centerLat = group.reduce((s, idx) => s + geojson.features[idx].geometry.coordinates[1], 0) / group.length

        const bounds = new mapboxgl.LngLatBounds()
        group.forEach(idx => bounds.extend(geojson.features[idx].geometry.coordinates))

        const clusterEl = document.createElement('div')
        createApp(Cluster, { text: String(group.length), type: 'rounded' }).mount(clusterEl)
        clusterEl.style.cursor = 'pointer'
        clusterEl.addEventListener('click', () => map.fitBounds(bounds, { padding: 100, maxZoom: 10, speed: 2.5 }))

        proximityClusterMarkers.value.push(
          markRaw(new mapboxgl.Marker({ element: clusterEl, anchor: 'center' })
            .setLngLat([centerLng, centerLat])
            .addTo(map))
        )
      }
    }
  }

  const applyVisibility = (zoom: number) => {
    const showClusters = zoom < CLUSTER_ZOOM_THRESHOLD
    if (showClusters) {
      stepMarkers.value.forEach(m => {
        if (m.getPopup()?.isOpen()) m.togglePopup()
      })
      proximityClusterMarkers.value.forEach(m => m.remove())
      proximityClusterMarkers.value = []
    }
    travelClusterMarkers.value.forEach(m => {
      m.getElement().style.display = showClusters ? '' : 'none'
    })
    stepMarkers.value.forEach(m => {
      m.getElement().style.display = showClusters ? 'none' : ''
    })
    if (!showClusters) {
      updateProximityClusters()
    }
  }

  applyVisibility(map.getZoom())
  zoomHandler.value = () => applyVisibility(map.getZoom())
  map.on('zoom', zoomHandler.value)
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
