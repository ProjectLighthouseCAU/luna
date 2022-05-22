<script lang="ts">
import { computed } from '@vue/runtime-core'
import { useDisplay } from 'vuetify'

export default () => {
  const vuetifyDisplay = useDisplay()
  const isMobile = computed(() => vuetifyDisplay.mobile.value)
  const compactIfMobile = computed(() => isMobile.value ? 'compact' : 'default')
  return { isMobile, compactIfMobile }
}

</script>
