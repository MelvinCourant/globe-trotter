<script setup lang="ts">
import '../assets/css/layouts/_navbar.scss'
import type { Data } from '@generated/data'
import {usePage} from "@inertiajs/vue3";
import Account from "~/components/Account.vue";
import Button from "~/components/inputs/Button.vue";
import { toast } from 'vue-sonner'
import { computed, onMounted, ref, watch} from "vue";

const page = usePage<Data.SharedProps>()
const isShared = computed(() => page.url.startsWith('/shared/'))
const stepOpen = ref<boolean>(false)

onMounted(() => handleStepParam(page.url))

watch(() => page.url, handleStepParam)

function handleStepParam(url: string) {
  const stepId = new URLSearchParams(url.split('?')[1] ?? '').get('step')

  stepOpen.value = !!stepId;
}

async function getShareLink() {
  if(!page.props.user) return

  if(page.props.user.shareLink) {
    await navigator.clipboard.writeText(`${window.location.origin}/shared/${page.props.user.shareLink}`);
  } else {
    const json = await fetch('/create-share-link').then(response => response.json())

    await navigator.clipboard.writeText(`${window.location.origin}/shared/${json.shareLink}`);
  }

  toast.success('Lien copié dans le presse-papier')
}
</script>

<template>
  <header
    class="navbar"
    v-show="!stepOpen"
  >
    <nav>
      <template v-if="page.props.user">
        <Account :user="page.props.user" />
        <Button
          v-if="page.props.user && !isShared"
          :style="'primary'"
          @click="getShareLink"
        >
          Partager sa carte
        </Button>
      </template>
      <template v-else>
        <div class="navbar__authentification">
          <Button :route="'new_account.create'" :style="'primary'">Inscription</Button>
          <Button :route="'session.create'">Connexion</Button>
        </div>
      </template>
    </nav>
  </header>
</template>
