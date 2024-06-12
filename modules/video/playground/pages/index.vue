<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div class="Page-demo">
      <h2>Video - Autoplay and Loop</h2>
      <AppVideo
        class="Page-video"
        :autoplay="true"
        :loop="true"
        src="/videos/fall.mp4"
        :width="16"
        :height="9"
        @on-play="() => console.log('play')"
        @on-pause="() => console.log('pause')"
        @on-loaded="() => console.log('onLoaded')"
      />
    </div>

    <div class="Page-demo">
      <h2>Video - Controls</h2>
      <AppVideo
        class="Page-video"
        :autoplay="false"
        :controls="true"
        :loop="false"
        src="/videos/fall.mp4"
      />
    </div>

    <div class="Page-demo">
      <h2>Video - Vimeo</h2>
      <AppVideoVimeo
        class="Page-video"
        :autoplay="false"
        :controls="true"
        :loop="false"
        :video="vimeoVideo"
        :vimeo-cover="true"
      />
    </div>

    <div class="Page-demo">
      <h2>Video - Mux</h2>
      <AppVideoMux
        class="Page-video"
        :autoplay="false"
        :controls="true"
        :loop="false"
        :video="muxVideo"
        :mux-cover="true"
      />
    </div>


    <div class="Page-demo">
      <h2>Iframe - Embed</h2>
      <AppIframeEmbed
        class="Page-iframe"
        :embed="embed"
      >
        <template #cover>
          <img
            loading="lazy"
            :src="`/cover.jpg`"
          >
        </template>
      </AppIframeEmbed>
    </div>

    <div class="Page-demo">
      <h2>Iframe - Youtube</h2>
      <AppIframeYoutube
        class="Page-iframe"
        url="https://www.youtube.com/embed/E5jEjJZeCX8?feature=oembed&amp;autoplay=1&amp;rel=0&amp;modestbranding=1"
      >
        <template #cover>
          <img
            loading="lazy"
            :src="`/cover.jpg`"
          >
        </template>
      </AppIframeYoutube>
    </div>


    <div class="Page-demo">
      <h2>Iframe - Vimeo</h2>
      <AppIframeVimeo
        class="Page-iframe"
        url="https://vimeo.com/265070712"
      >
        <template #cover>
          <img
            loading="lazy"
            :src="`/cover.jpg`"
          >
        </template>
      </AppIframeVimeo>
    </div>
  </div>
</template>

<script setup>
import muxVideo from '../../src/runtime/mock/muxVideo'
import vimeoVideo from '../../src/runtime/mock/vimeoVideo'

const embed = `<iframe width="200" height="113" src="https://www.youtube.com/embed/E5jEjJZeCX8?feature=oembed&amp;autoplay=1&amp;rel=0&amp;modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="Nouvelle collection « Les Classiques » : découvrez nos titres pour le collège et le lycée !" data-dashlane-frameid="260"></iframe>`

</script>

<style scoped>
.Page {
  min-height: 300vh;
  padding-bottom: 50vh;
}

.Page-demo {
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 80px;
}

.Page-video {
  position: relative;
  width: 60vw;
  min-width: 375px;
  margin-top: 50px;
  background-color: black;
}

.Page-iframe {
  position: relative;
  width: 60vw;
  min-width: 375px;
  margin-top: 50px;
  aspect-ratio: 16 / 9;
  background-color: black;
}
</style>
