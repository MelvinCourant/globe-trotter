<script setup lang="ts">
import '../assets/css/layouts/_navbar.scss'
import type { Data } from '@generated/data'
import {usePage} from "@inertiajs/vue3";
import Account from "~/components/Account.vue";
import Button from "~/components/inputs/Button.vue";

const page = usePage<Data.SharedProps>()
</script>

<template>
  <header class="navbar">
    <nav>
      <template v-if="page.props.user">
        <Account :user="page.props.user" />
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
