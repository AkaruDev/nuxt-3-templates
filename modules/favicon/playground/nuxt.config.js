
import { defineNuxtConfig } from 'nuxt/config'

const title = "My app"
const themeColor = "#FFFFFF"

export default defineNuxtConfig({
  modules: ['../src/module'],
  favicon: {
    rfg: {
      design: {
        ios: {
          pictureAspect: 'noChange',
          assets: {
            ios6AndPriorIcons: false,
            ios7AndLaterIcons: false,
            precomposedIcons: false,
            declareOnlyDefaultIcon: true
          },
          appName: title
        },
        desktopBrowser: {
          design: 'raw'
        },
        windows: {
          pictureAspect: 'noChange',
          backgroundColor: themeColor,
          onConflict: 'override',
          assets: {
            windows80Ie10Tile: false,
            windows10Ie11EdgeTiles: {
              small: false,
              medium: true,
              big: false,
              rectangle: false
            }
          },
          appName: title
        },
        androidChrome: {
          pictureAspect: 'noChange',
          themeColor,
          manifest: {
            name: title,
            display: 'standalone',
            orientation: 'notSet',
            onConflict: 'override',
            declared: true
          },
          assets: {
            legacyIcon: false,
            lowResolutionIcons: false
          }
        },
        safariPinnedTab: {
          pictureAspect: 'blackAndWhite',
          threshold: 63.125,
          themeColor
        }
      },
      settings: {
        scalingAlgorithm: 'Mitchell',
        errorOnImageTooSmall: false,
        readmeFile: false,
        htmlCodeFile: false,
        usePathAsIs: false
      }
    }
  }
})
