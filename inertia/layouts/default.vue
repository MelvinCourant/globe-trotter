<script setup lang="ts">
import { watch } from 'vue'
import { usePage } from '@inertiajs/vue3'
import { toast, Toaster } from 'vue-sonner'
import type { Data } from '@generated/data'
import { Link, Form } from '@adonisjs/inertia/vue'

const page = usePage<Data.SharedProps>()

watch(
  () => page.url,
  () => toast.dismiss()
)

watch(
  () => page.props.flash,
  (flashMessages) => {
    if (flashMessages.error) {
      toast.error(flashMessages.error)
    }
    if (flashMessages.success) {
      toast.success(flashMessages.success)
    }
  },
  { immediate: true }
)
</script>

<template>
  <header>
    <div>
      <div>
        <nav>
          <template v-if="page.props.user">
            <span>{{ page.props.user.initials }}</span>
            <Form route="session.destroy">
              <button type="submit">Logout</button>
            </Form>
          </template>
          <template v-else>
            <Link route="new_account.create">Signup</Link>
            <Link route="session.create">Login</Link>
          </template>
        </nav>
      </div>
    </div>
  </header>

  <main>
    <slot />
  </main>

  <Toaster position="top-center" rich-colors />
</template>
