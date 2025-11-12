<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

interface StorageMessage {
  type: "get" | "set" | "remove" | "response";
  key: string;
  value?: string;
}

const iframeRef = ref<HTMLIFrameElement | null>(null);

const handleMessage = (event: MessageEvent<StorageMessage>) => {
  if (event.origin !== "http://localhost:2000") return;

  if (event.data.type === "response") {
    console.log(`Value dari ${event.data.key}:`, event.data.value);
  }
};

onMounted(() => {
  window.addEventListener("message", handleMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessage);
});

const sendMessage = (msg: StorageMessage) => {
  iframeRef.value?.contentWindow?.postMessage(msg, "http://localhost:2000");
};

const getToken = () => {
  sendMessage({ type: "get", key: "cred" });
};

</script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <iframe ref="iframeRef" src="http://localhost:2000" title="storage" 
    style="width: 100%; height: 600px; border: 1px solid gray; margin-bottom: 20px; display: none;"></iframe>

  <div>
    <button @click="getToken">Get Token</button>
  </div>
</template>

<style scoped></style>
