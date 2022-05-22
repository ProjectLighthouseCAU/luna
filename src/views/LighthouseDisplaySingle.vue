<template>
  <v-dialog
    v-model="dialog"
    max-width="100vw"
    max-height="100vh"
    @click="goBack"
  >
    <v-container>
      <v-responsive :aspect-ratio="0.865">
        <canvas
          v-if="status !== 'Just created'"
          ref="canvas"
          width="2320"
          height="1120"
        />
        <v-progress-circular
          v-else
          size="128"
          indeterminate
        />
      </v-responsive>
    </v-container>
  </v-dialog>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted, onBeforeUnmount, computed } from '@vue/runtime-core'
import { encode, decode } from '@msgpack/msgpack'
import { useRoute, useRouter } from 'vue-router'

const hardcoded = {
  wsUrl: 'wss://lighthouse.uni-kiel.de/websocket',
  user: 'Gluedemann2',
  token: 'API-TOK_YDtr-BoxD-8vEU-5CNu-CkTr'
}
const dialog = true

const status = ref('Just created')
const response = ref('Response')
const rnum = ref(0)
const warnings = ref([])
const payload = ref(new Uint8Array())
const ws = ref<WebSocket>(null)
const lastMessage = ref('never')
const canvas = ref<HTMLCanvasElement>(null)

const emit = defineEmits(['update'])

const route = useRoute()
const router = useRouter()

const user = computed(() => route.params.id)

function updateStatus(text: string) {
  status.value = text
}

function goBack() {
  router.push('/')
}

function drawLighthouse(data: number[]) {
  function componentToHex(c) {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b)
  }

  const dataGroupedPixels = []
  while (data.length) {
    dataGroupedPixels.push(data.splice(0, 3))
  }

  const ctx = canvas.value.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 2320, 1120)
  ctx.stroke()

  dataGroupedPixels.forEach((p, i) => {
    ctx.fillStyle = rgbToHex(p[0], p[1], p[2])
    ctx.fillRect(60 + 80 * (i % 28), 20 + 80 * Math.floor(i / 28), 40, 40)
    ctx.stroke()
  })
}

onMounted(async() => {
  ws.value = new WebSocket(hardcoded.wsUrl)

  ws.value.onopen = () => {
    updateStatus('Opening Websocket')
    const data = {
      REID: 0,
      AUTH: { USER: hardcoded.user, TOKEN: hardcoded.token },
      VERB: 'STREAM',
      PATH: ['user', user.value, 'model'],
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
    drawLighthouse(Array.from(payload.value))
  }
})

onBeforeUnmount(() => {
  ws.value.close()
})

</script>

<style lang="scss" scoped>
canvas {
  height: 100vmin;
  max-height: 90vh;
  max-width: 100vw;
  image-rendering: crisp-edges;
  aspect-ratio: 0.865;
  border-radius: 2ch;
}
</style>
