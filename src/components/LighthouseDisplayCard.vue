<template>
  <v-card
    variant="text"
    density="compact"
    @click="showSingle"
  >
    <v-card-title class="text-md-body-1 text-body-2 text-truncate d-block">
      {{ props.user }}
    </v-card-title>
    <v-card-content class="text-center align-content-center">
      <v-responsive
        :aspect-ratio="0.8375"
        class="align-center"
      >
        <canvas
          v-if="status !== 'Just created'"
          ref="canvas"
          width="28"
          height="14"
        />
        <v-progress-circular
          v-else
          size="64"
          indeterminate
        />
      </v-responsive>
    </v-card-content>
  </v-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from '@vue/runtime-core'
import { encode, decode } from '@msgpack/msgpack'
import { useRouter } from 'vue-router'

const hardcoded = {
  wsUrl: 'wss://lighthouse.uni-kiel.de/websocket',
  user: 'Gluedemann2',
  token: 'API-TOK_YDtr-BoxD-8vEU-5CNu-CkTr'
}

const props = defineProps({
  user: {
    type: String,
    required: true
  }
})

const status = ref('Just created')
const response = ref('Response')
const rnum = ref(0)
const warnings = ref([])
const payload = ref(new Uint8Array())
const ws = ref<WebSocket>(null)
const lastMessage = ref('never')
const canvas = ref<HTMLCanvasElement>(null)

const emit = defineEmits(['update'])

const router = useRouter()

function updateStatus(text: string) {
  status.value = text
}

function showSingle() {
  router.push(`/display/${props.user}`)
}

onMounted(async() => {
  ws.value = new WebSocket(hardcoded.wsUrl)

  ws.value.onopen = () => {
    updateStatus('Opening Websocket')
    const data = {
      REID: 0,
      AUTH: { USER: hardcoded.user, TOKEN: hardcoded.token },
      VERB: 'STREAM',
      PATH: ['user', props.user, 'model'],
      META: {},
      PAYL: {}
    }
    const dataEncoded = encode(data)
    ws.value.send(dataEncoded)
    updateStatus('Waiting for response')
  }
  ws.value.onmessage = async(msgEvent: MessageEvent<Blob>) => {
    updateStatus('Connected')
    const dataEncoded = await msgEvent.data.arrayBuffer()
    const data = decode(dataEncoded)
    const { RESPONSE, RNUM, WARNIGS, PAYL } = data
    response.value = RESPONSE
    rnum.value = RNUM
    warnings.value = WARNIGS
    payload.value = PAYL
    lastMessage.value = new Date().toLocaleTimeString('en-us', { hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })

    const imageData = []
    payload.value.forEach((value, i) => {
      imageData.push(value)
      if (i % 3 === 2) {
        imageData.push(255)
      }
    })
    const ctx = canvas.value.getContext('2d')
    ctx?.putImageData(new ImageData(new Uint8ClampedArray(imageData), 28, 14), 0, 0)
  }
})

onBeforeUnmount(() => {
  ws.value.close()
})

</script>

<style lang="scss" scoped>
canvas {
  width: 100%;
  aspect-ratio: 0.865;
  image-rendering: pixelated;
  border-radius: 1ch;
}
</style>
