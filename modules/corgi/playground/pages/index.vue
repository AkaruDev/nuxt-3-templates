<template>
  <main class="Home">
    <div class="Home-side">
      <h1>CorGI 🐶</h1>
      <ul>
        <li
          v-for="(item, i) in pages"
          :key="`item-${i}`"
        >
          <nuxt-link :to="item.to">
            {{ item.label }}
          </nuxt-link>
        </li>
      </ul>
    </div>

    <NuxtPage class="Home-page" />
  </main>
</template>

<script setup>
// Data
const pages = [
  { label: 'Envmap', to: '/envmap' },
  { label: 'GLTF models', to: '/models' },
  { label: 'Texture', to: '/texture' },
  { label: 'Shaders', to: '/shaders' },
  { label: 'Custom shaders', to: '/custom-shaders' },
  { label: 'Component', to: '/component' },
  { label: 'Planes', to: '/planes' },
  { label: 'Particles', to: '/particles' },
  { label: 'Particles flowfield', to: '/particles-flowfield' },
  { label: 'Flowmap', to: '/flowmap' },
]

</script>

<style scoped>
.Home {
  position: relative;
  display: flex;
  flex-flow: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;

  gap: 0;

  background-color: #161616;

  z-index: 0;
}

.Home-side {
  max-width: 300px;
  height: 100vh;
  background-color: #161616;

  padding: 2rem 3rem;

  overflow-x: hidden;
  overflow-y: auto;

  ul {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    justify-content: flex-start;

    margin-top: 50px;
    gap: 30px;

    width: 200px;

    font-size: 18px;
    text-align: left;
  }

  li {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    list-style: none;

    gap: 1rem;

    &::before {
      display: block;
      width: 4px;
      height: 4px;

      background-color: white;

      transform: rotate(45deg);
      content: '';
    }
  }

  a {
    height: 20px;
    font-size: 16px;
    font-family: sans-serif;
    text-decoration: none;

    &:hover {
      color: #798E7B;
    }

    &.router-link-active {
      font-weight: bold;
      color: #798E7B;

    }
  }
}

.Home-page {
  width: 100%;
}
</style>
