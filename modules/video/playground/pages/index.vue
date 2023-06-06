<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <div class="Page-demo">
      <h2> Video with cover and embed player</h2>
      <AppVideo class="Page-video">
        <template #cover>
          <img src="/cover.jpg">
        </template>
        <template #player>
          <AppVideoEmbed :embed="embed" />
        </template>
      </AppVideo>
    </div>
  </div>
</template>

<script setup>

const embed = `<iframe width="200" height="113" src="https://www.youtube.com/embed/E5jEjJZeCX8?feature=oembed&amp;autoplay=1&amp;rel=0&amp;modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="Nouvelle collection « Les Classiques » : découvrez nos titres pour le collège et le lycée !" data-dashlane-frameid="260"></iframe>`
</script>

<style scoped>
.Page {
  min-height: 300vh;
}

.Page-demo {
  margin-top: 80px;
}

.AppVideo.Page-video {
  position: relative;
  width: 60vw;
  aspect-ratio: 16/9;

  margin-top: 50px;
}
</style>
