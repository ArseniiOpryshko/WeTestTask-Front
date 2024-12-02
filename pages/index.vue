<script lang="ts" setup>
import { IWorker } from "~/types/worker.types";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

useHead({
  title: "Home",
});

const config = useRuntimeConfig();
const workers = ref<IWorker[]>([]);
const error = ref<string | null>(null);
const router = useRouter();
const selectedLogo = ref<File | null>(null);
const selectedFileName = ref("");

const formSchema = toTypedSchema(
  z.object({
    id: z.number().optional(),
    firstName: z.string().nonempty("First Name is required"),
    lastName: z.string().nonempty("Last Name is required"),
    dateOfBirth: z.string().nonempty("Date of Birth is required"),
    email: z.string().email("Invalid Email").nonempty("Email is required"),
    phone: z.string().nonempty("Phone is required"),
    logo: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

async function fetchWorkers() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      await router.push("/login");
    }

    const { data, error } = await useFetch<IWorker[]>(
      config.public.API_URL + "workers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    workers.value = data.value || [];
    if (error.value.statusCode == 401) {
      await router.push("/login");
    }
  } catch (err) {
    error.value = (err as Error).message;
  }
}

onMounted(async () => {
  await nextTick();

  await fetchWorkers();
});

const workerCards = computed(() =>
  workers.value.map((worker: IWorker) => ({
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    email: worker.email,
    dateOfBirth: worker.dateOfBirth,
    phone: worker.phone,
    logo: worker.logo,
  }))
);

async function onDelete(id: number) {
  const token = localStorage.getItem("token");

  if (!token) {
    await router.push("/login");
  }

  await useFetch<IWorker[]>(config.public.API_URL + `workers/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    onResponse({ response }) {
      alert(response._data.message);
    },
  });
  workers.value = workers.value.filter((worker: IWorker) => worker.id !== id);
}

const updateWorkerArray = (updatedWorker: IWorker) => {
  const index = workers.value.findIndex(
    (worker: IWorker) => worker.id === updatedWorker.id
  );

  if (index !== -1) {
    workers.value[index] = updatedWorker;
  } else {
    workers.value.push(updatedWorker);
  }
};

function editWorker(worker: IWorker) {
  const dateObj = new Date(worker.dateOfBirth);

  selectedFileName.value = worker.logo;
  form.setValues({
    id: worker.id,
    firstName: worker.firstName,
    lastName: worker.lastName,
    dateOfBirth: dateObj.toISOString().split("T")[0],
    email: worker.email,
    phone: worker.phone,
    logo: worker.logo,
  });
}
</script>

<template>
  <div
    class="p-24 justify-center justify-items-center bg-gray-500 min-h-screen w-full"
  >
    <div class="text-center">
      <h2 class="text-4xl font-extrabold">Meet our workers</h2>
    </div>
    <div v-if="workers.length === 0">
      <h2 class="mt-10 text-2xl">No workers found</h2>
    </div>
    <div
      v-else
      class="grid sm:grid-cols-3 gap-8 max-sm:justify-center mt-12 h-min"
    >
      <WorkerCard
        v-for="worker in workers"
        :key="worker.id"
        :worker="worker"
        :onDelete="onDelete"
        :editWorker="editWorker"
      />
    </div>
    <WorkerForm :updateWorkerArray="updateWorkerArray" />
  </div>
</template>
