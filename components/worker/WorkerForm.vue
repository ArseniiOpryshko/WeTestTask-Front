<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { IWorker } from "~/types/worker.types";
import { defineProps } from "vue";
const config = useRuntimeConfig();

const form = useForm();
const selectedLogo = ref<File | null>(null);
const selectedFileName = ref("");
const { updateWorkerArray } = defineProps<{
  updateWorkerArray: (updatedWorker: IWorker) => void;
}>();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authorization token is missing");
    }

    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("dateOfBirth", values.dateOfBirth);

    if (selectedLogo.value) {
      formData.append("file", selectedLogo.value);
    }
    if (values.id) {
      const response = await useFetch(
        config.public.API_URL + `workers/${values.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      updateWorkerArray(response.data.value);
    } else {
      const response = await useFetch(config.public.API_URL + "workers", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      updateWorkerArray(response.data.value);
    }

    form.resetForm();
  } catch (err) {
    console.error("Error submitting form:", err);
  }
});

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input && input.files && input.files.length > 0) {
    selectedLogo.value = input.files[0];
    selectedFileName.value = input.files[0].name;
  }
};
</script>

<template>
  <div class="mt-12 bg-gray-700 p-6 rounded">
    <h3 class="text-xl font-bold text-white mb-4">Worker Data</h3>
    <form @submit.prevent="onSubmit">
      <div class="grid grid-cols-2 gap-4">
        <UiFormField name="firstName" v-slot="{ field, meta }">
          <UiFormItem>
            <UiInput placeholder="First Name" v-bind="field" />
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="lastName" v-slot="{ field, meta }">
          <UiFormItem>
            <UiInput placeholder="Last Name" v-bind="field" />
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="dateOfBirth" v-slot="{ field, meta }">
          <UiFormItem>
            <UiInput placeholder="Date of Birth" type="date" v-bind="field" />
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="email" v-slot="{ field, meta }">
          <UiFormItem>
            <UiInput placeholder="Email" type="email" v-bind="field" />
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="phone" v-slot="{ field, meta }">
          <UiFormItem>
            <UiInput placeholder="Phone" v-bind="field" />
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
        <UiFormField name="logo">
          <UiFormItem>
            <UiInput @change="handleFileChange" type="file" />
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
      </div>
      <p v-if="selectedFileName">Attached file: {{ selectedFileName }}</p>
      <UiButton type="submit"> Add / Change Worker </UiButton>
    </form>
  </div>
</template>
