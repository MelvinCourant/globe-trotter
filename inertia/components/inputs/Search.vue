<script setup lang="ts">
import '../../assets/css/components/inputs/_search.scss'
import {ref, onMounted, onUnmounted} from "vue";

const props = defineProps({
  attributes: {
    type: Object,
    required: true,
  },
  dataInvalid: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  options: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(["search", "updateValue"]);

const isOpen = ref(false);
const inputRef = ref(null);
const entriesRef = ref(null);
const listRef = ref(null);

function onClickOutside(event) {
  if (
    !entriesRef.value?.contains(event.target) &&
    !listRef.value?.contains(event.target)
  ) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener("click", onClickOutside));
onUnmounted(() => document.removeEventListener("click", onClickOutside));

function selectOption(option) {
  emit("updateValue", option);
  isOpen.value = false;
  inputRef.value.value = option.text;
}

function search(value) {
  emit("search", value);
  isOpen.value = props.options.length > 0;
}
</script>

<template>
  <div class="search">
    <div class="search__container">
      <label for="search" class="search__label">
        {{ label }}
      </label>
      <div
        ref="entriesRef"
        :class="[
          'search__entries',
          {
            'search__entries--open': isOpen,
          },
        ]"
      >
        <slot />
        <input
          v-bind="attributes"
          ref="inputRef"
          :data-invalid="dataInvalid"
          role="search"
          class="search__input"
          id="search"
          aria-controls="listbox"
          aria-haspopup="listbox"
          aria-expanded="false"
          autocomplete="off"
          @input="search($event.target.value)"
          @focus="isOpen = options.length > 0"
        />
      </div>
      <ul
        ref="listRef"
        role="listbox"
        :class="[
          'search__list',
          {
            'search__list--open': isOpen,
          },
        ]"
        id="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          role="option"
          tabindex="0"
          class="search__option"
          @click="selectOption(option)"
          @keydown.enter="selectOption(option)"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
    <div
      v-if="error"
      class="search__error"
    >
      {{ error }}
    </div>
  </div>
</template>
