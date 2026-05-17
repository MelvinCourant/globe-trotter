<script setup lang="ts">
import '../../assets/css/components/inputs/_combobox.scss'
import {ref, onMounted, onUnmounted} from "vue";
import Chip from "~/components/Chip.vue";

const props = defineProps({
  attributes: {
    type: Object,
    required: true,
  },
  chips: {
    type: Array,
    default: () => [],
  },
  chipsMax: {
    type: Number,
    default: 0,
  },
  customEntry: {
    type: Boolean,
    default: false,
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
const emit = defineEmits(["updateChips"]);

const chips = ref(props.chips);
const isOpen = ref(false);
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

function addCustomEntry(event) {
  const value = event.target.value.trim();
  if (!value) return;

  const newChip = { text: value, value: crypto.randomUUID() };

  if (props.chipsMax === 0 || chips.value.length < props.chipsMax) {
    chips.value.push(newChip);
    emit("updateChips", chips.value);
  }

  event.target.value = "";
  props.options.forEach((option) => { option.display = true; });
}

function updateChips(value) {
  if (
    !chips.value.find((v) => v.value === value) && props.chipsMax > 0 && chips.value.length < props.chipsMax ||
    !chips.value.find((v) => v.value === value) && props.chipsMax === 0
  ) {
    chips.value.push(props.options.find((option) => option.value === value));
  } else if(!chips.value.find((v) => v.value === value) && props.chipsMax > 0 && chips.value.length === props.chipsMax) {
    return
  } else
   {
    chips.value = chips.value.filter((v) => v.value !== value);
  }

  emit("updateChips", chips.value);
  document.querySelectorAll(".combobox__input").forEach((input) => {
    input.value = "";
  });
  props.options.forEach((option) => {
    option.display = true;
  });
}

function search(value) {
  props.options.forEach((option) => {
    option.display = option.text.toLowerCase().includes(value.toLowerCase());
  });
  isOpen.value = props.options.some((option) => option.display);
}
</script>

<template>
  <div class="combobox">
    <div class="combobox__container">
      <label for="combobox" class="combobox__label">
        {{ label }}
      </label>
      <div
        ref="entriesRef"
        :class="[
          'combobox__entries',
          {
            'combobox__entries--open': isOpen,
          },
        ]"
      >
        <ul v-if="chips.length > 0" class="combobox__chips">
          <li v-for="chip in chips" :key="chip.value">
            <Chip :text="chip.text" :value="chip.value" :canBeDeleted="true" @deleteChip="updateChips(chip.value)"/>
          </li>
        </ul>
        <input
          v-bind="attributes"
          :data-invalid="dataInvalid"
          role="combobox"
          class="combobox__input"
          id="combobox"
          aria-controls="listbox"
          aria-haspopup="listbox"
          aria-expanded="false"
          autocomplete="off"
          @input="search($event.target.value)"
          @keydown.enter.prevent="customEntry && addCustomEntry($event)"
          @focus="isOpen = options.some((o) => o.display)"
          v-if="(chipsMax > 0 && chips.length < chipsMax) || chipsMax === 0"
        />
        <div
          v-if="error"
          class="combobox__error"
        >
          {{ error }}
        </div>
      </div>
      <ul
        ref="listRef"
        role="listbox"
        :class="[
          'combobox__list',
          {
            'combobox__list--open': isOpen,
          },
        ]"
        id="listbox"
      >
        <li
          v-for="option in options"
          :key="option.value"
          role="option"
          :tabindex="option.display ? 0 : -1"
          :class="[
            'combobox__option',
            {
              'combobox__option--selected': chips.find(
                (v) => v.value === option.value,
              ),
            },
          ]"
          v-show="option.display"
          @click="isOpen = false; updateChips(option.value);"
          @keydown.enter="isOpen = false; updateChips(option.value);"
        >
          {{ option.text }}
        </li>
      </ul>
    </div>
  </div>
</template>
