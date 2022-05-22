// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify(
  {
    components,
    directives,
    icons:
    { defaultSet: 'mdi' },
    breakpoint: {
      thresholds: {
        xs: 600,
        sm: 800,
        md: 1200,
        lg: 3000
      },
      scrollBarWidth: 24
    }
  }
)
