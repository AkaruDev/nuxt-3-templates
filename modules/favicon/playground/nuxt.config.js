
import { defineNuxtConfig } from 'nuxt/config'
const title = "My app"
const theme_color = "#FFFFFF"

export default defineNuxtConfig({
  modules: ['../src/module'],
  favicon: {
    favicon_design: {
      ios: {
        pictureAspect: 'no_change',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: title
      },
      desktop_browser: {
        design: 'raw'
      },
      windows: {
        picture_aspect: 'no_change',
        background_color: theme_color,
        on_conflict: 'override',
        assets: {
          windows_80_ie_10_tile: false,
          windows_10_ie_11_edge_tiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        },
        app_name: title
      },
      android_Chrome: {
        picture_aspect: 'no_change',
        theme_color,
        manifest: {
          name: title,
          display: 'standalone',
          orientation: 'notSet',
          on_conflict: 'override',
          declared: true
        },
        assets: {
          legacy_icon: false,
          low_resolution_icons: false
        }
      },
      safari_pinned_tab: {
        picture_aspect: 'black_and_white',
        threshold: 63.125,
        theme_color
      }
    },
    settings: {
      scaling_algorithm: 'Mitchell',
      error_on_image_too_small: false,
      readme_file: false,
      html_code_file: false,
      use_path_as_is: false
    }
  }
})
