<template>
  <div class="Page home">
    <h1>Home</h1>
    <nuxt-link to="/page">
      Go to page
    </nuxt-link>

    <!-- Embed player -->
    <div class="Page-demo">
      <h2>Video with embed player and cover</h2>
      <AppVideo
        class="Page-video"
        :autoplay="false"
        :embed="embed"
      >
        <template #cover>
          <img
            class="Page-img"
            src="/cover.jpg"
          >
        </template>
        <template #btplay>
          <button
            type="button"
            aria-label="Play"
            class="Page-btplay"
          />
        </template>
      </AppVideo>
    </div>

    <!-- Vimeo player -->
    <div class="Page-demo">
      <h2>Video with vimeo player and cover</h2>
      <AppVideo
        class="Page-video"
        vimeo="https://vimeo.com/265070712"
      >
        <template #cover>
          <img
            class="Page-img"
            src="/cover.jpg"
          >
        </template>

        <template #btplay>
          <button
            type="button"
            aria-label="Play"
            class="Page-btplay"
          />
        </template>
      </AppVideo>
    </div>

    <div class="Page-demo">
      <h2>Video with Vimeo player and autoplay</h2>
      <AppVideo
        class="Page-video"
        vimeo="https://vimeo.com/265070712"
      />
    </div>

    <div class="Page-demo">
      <h2>Video with Vimeo player and controls</h2>
      <AppVideo
        class="Page-video"
        :controls="true"
        vimeo="https://vimeo.com/265070712"
      >
        <template #cover>
          <img
            class="Page-img"
            src="/cover.jpg"
          >
        </template>
        <template #btplay>
          <button
            type="button"
            aria-label="Play"
            class="Page-btplay"
          />
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
  padding-bottom: 50vh;
}

.Page-demo {
  margin-top: 80px;
}

.AppVideo.Page-video {
  position: relative;
  width: 60vw;
  aspect-ratio: 16/9;

  margin-top: 50px;

  background-color: black;
}

.Page-btplay {
  width: 0;
  height: 0;

  background-color: transparent;
  border-style: solid;
  border-width: 30px 0 30px 60px;
  border-color: transparent transparent transparent #52427a;

  cursor: pointer;
}

.Page-img {
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  object-fit: cover;
}
</style>
