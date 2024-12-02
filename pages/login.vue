<script lang="ts" setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

useHead({
  title: "Login",
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    email: z
      .string()
      .nonempty("Field is required")
      .email("Must be a valid email"),
    password: z.string().nonempty("Field is required").min(6),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(
  async (values: { email: string; password: string }) => {
    console.log("Form submitted!", values);

    const response = await useFetch(config.public.API_URL + "auth", {
      method: "POST",
      body: values,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.error.value) {
      form.setErrors({
        email: response.error.value.message || "Login failed",
      });
      return;
    }
    const token = response.data.value;

    if (token) {
      localStorage.setItem("token", token);
      await router.push("/");
      authStore.set({ email: values.email, status: true });
    } else {
      console.error("No token found in response");
    }
  }
);
</script>

<template>
  <div class="flex justify-center items-center min-h-screen w-full">
    <div class="rounded bg-slate-700 w-1/4 p-10 min-w-fit">
      <h1 class="text-center font-bold mb-5 text-2xl">Login</h1>

      <form @submit.prevent="onSubmit">
        <UiFormField name="email" v-slot="{ field, meta }">
          <UiFormItem>
            <UiFormLabel>Email</UiFormLabel>
            <UiFormControl>
              <UiInput
                type="email"
                placeholder="example@example.com"
                v-bind="field"
              />
            </UiFormControl>
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>

        <UiFormField name="password" v-slot="{ field, meta }">
          <UiFormItem>
            <UiFormLabel>Password</UiFormLabel>
            <UiFormControl>
              <UiInput
                type="password"
                placeholder="Enter your password"
                v-bind="field"
              />
            </UiFormControl>
            <UiFormMessage>{{ meta?.error }}</UiFormMessage>
          </UiFormItem>
        </UiFormField>
        <UiButton type="submit"> Submit </UiButton>
      </form>
    </div>
  </div>
</template>
