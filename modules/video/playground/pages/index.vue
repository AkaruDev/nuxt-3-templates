<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <!-- Embed player -->
    <div class="Page-demo">
      <h2>Video embed</h2>
      <AppVideoEmbed
        class="Page-video"
        :src="embed"
        cover="/cover.jpg"
      />
    </div>

    <div class="Page-demo">
      <h2>Video Vimeo</h2>
      <AppVideoVimeo
        class="Page-video"
        url="https://vimeo.com/265070712"
        cover="/cover.jpg"
      />
    </div>

    <AppVideoFile
      class="Page-video"
      url="/videos/fall"
      cover="/cover.jpg"
    />
  </div>
</template>

<script setup>

const embed = `<iframe width="200" height="113" src="https://www.youtube.com/embed/E5jEjJZeCX8?feature=oembed&amp;autoplay=1&amp;rel=0&amp;modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="Nouvelle collection « Les Classiques » : découvrez nos titres pour le collège et le lycée !" data-dashlane-frameid="260"></iframe>`
</script>

<style scoped>
.Page {
  min-height: 300vh;
  padding-bottom: 50vh;
}

.Page-demo {
  margin-top: 80px;
}

.AppVideoFile.Page-video,
.AppVideoEmbed.Page-video,
.AppVideoVimeo.Page-video {
  position: relative;
  width: 60vw;
  aspect-ratio: 16/9;

  margin-top: 50px;

  background-color: black;
}
</style>
