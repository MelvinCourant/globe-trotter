<script setup lang="ts">
import '../../assets/css/components/inputs/_profile-picture-input.scss'
import {nextTick, ref} from "vue";
import { heicTo, isHeic } from "heic-to"

const props = defineProps({
  error: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '',
  }
})
const emit = defineEmits(["update"])

const image = ref(props.image);

async function updateFile(event) {
  await nextTick();

  const input = event.target;
  let file = input.files[0];

  if (file) {
    if (await isHeic(file)) {
      const blob = await heicTo({ blob: file, type: 'image/jpeg', quality: 1 }) as Blob
      file = new File([blob], file.name.replace(/\.hei[cf]$/i, '.jpg'), { type: 'image/jpeg' })

      const dt = new DataTransfer()
      dt.items.add(file)
      input.files = dt.files
    }

    const reader = new FileReader();
    reader.addEventListener("load", (e) => {
      image.value = e.target?.result as string ?? ''
    });
    reader.readAsDataURL(file);
    emit('update', file);
  }
}
</script>

<template>
  <div class="profile-picture-input">
    <label
      class="profile-picture-input__label"
      for="image"
    >
      <img
        v-if="image"
        :src="image"
        alt="Image de profil"
        class="profile-picture-input__image"
      >
      <div
        v-else
        class="profile-picture-input__image profile-picture-input__image--placeholder"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
        >
          <path
            d="M1.33333 6.66665C1.33333 3.72113 3.72115 1.33331 6.66667 1.33331H20C22.9455 1.33331 25.3333 3.72113 25.3333 6.66665V20C25.3333 22.9455 22.9455 25.3333 20 25.3333H6.66667C3.72115 25.3333 1.33333 22.9455 1.33333 20V6.66665Z"
            stroke="var(--primary-hover)"
            stroke-width="2.66667"
          />
          <path
            d="M1.33333 17.3333L5.074 13.5926C6.25043 12.4162 8.20507 12.5924 9.1521 13.9603L11.6886 17.624C12.5748 18.9041 14.3647 19.1559 15.5697 18.17L18.7988 15.528C19.8592 14.6605 21.4044 14.7376 22.3731 15.7063L25.3333 18.6666"
            stroke="var(--primary-hover)"
            stroke-width="2.66667"
          />
          <circle
            cx="18.6667"
            cy="7.99998"
            r="2.66667"
            fill="var(--primary-hover)"
          />
        </svg>
      </div>
      <div class="profile-picture-input__input-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="12"
          viewBox="0 0 14 12"
          fill="none"
        >
          <path
            d="M0.666664 4.56936C0.666664 3.8867 1.22007 3.33329 1.90273 3.33329C2.37092 3.33329 2.79892 3.06877 3.0083 2.65001L3.55555 1.55552C3.62886 1.4089 3.66551 1.3356 3.70707 1.27184C3.92393 0.93917 4.27779 0.720476 4.67232 0.675287C4.74793 0.666626 4.82989 0.666626 4.99381 0.666626H8.33952C8.50344 0.666626 8.5854 0.666626 8.66101 0.675287C9.05554 0.720476 9.4094 0.93917 9.62625 1.27184C9.66782 1.3356 9.70447 1.4089 9.77778 1.55551L10.325 2.65001C10.5344 3.06877 10.9624 3.33329 11.4306 3.33329C12.1133 3.33329 12.6667 3.8867 12.6667 4.56936V7.90472C12.6667 9.24123 12.6667 9.90948 12.3601 10.3974C12.2003 10.6518 11.9851 10.8669 11.7307 11.0267C11.2429 11.3333 10.5746 11.3333 9.23809 11.3333H4.09524C2.75873 11.3333 2.09047 11.3333 1.6026 11.0267C1.34819 10.8669 1.13307 10.6518 0.973216 10.3974C0.666664 9.90948 0.666664 9.24123 0.666664 7.90472V4.56936Z"
            stroke="var(--color)"
            stroke-width="1.33333"
          />
          <circle
            cx="6.66667"
            cy="6.66654"
            r="2"
            stroke="var(--color)"
            stroke-width="1.33333"
          />
        </svg>
        <input
          id="image"
          class="profile-picture-input__input"
          name="image"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, .heic"
          @change="updateFile"
        >
      </div>
    </label>
    <div
      v-if="error"
      class="profile-picture-input__error"
    >
      {{ error }}
    </div>
  </div>
</template>
