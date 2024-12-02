<script setup lang="ts">
import { defineProps } from "vue";
import { IWorker } from "~/types/worker.types";
import { formatDate } from "~/utils/formatDate";

const config = useRuntimeConfig();

const { worker, onDelete, editWorker } = defineProps<{
  worker: IWorker;
  onDelete: (id: number) => void;
  editWorker: (worker: IWorker) => void;
}>();
</script>

<template>
  <div class="bg-gray-800 p-4 border rounded-lg">
    <img
      :src="config.public.API_URL + 'uploads/' + worker.logo"
      class="w-full object-fill object-top max-h-96"
      alt="Worker's logo"
    />
    <div class="text-center mt-4">
      <h4 class="text-base font-semibold text-white">
        {{ worker.firstName + " " + worker.lastName }}
      </h4>
      <p class="text-xs mt-2 text-white">{{ worker.email }}</p>
      <p class="text-xs mt-2 text-white">{{ worker.phone }}</p>
      <p class="text-xs mt-2 text-white">
        {{ formatDate(worker.dateOfBirth) }}
      </p>
      <div class="flex justify-between">
        <UiButton @click="editWorker(worker)" variant="secondary">
          Edit
        </UiButton>
        <UiButton @click="onDelete(worker.id)" variant="destructive">
          Delete
        </UiButton>
      </div>
    </div>
  </div>
</template>
