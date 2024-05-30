<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<div align="left">
  <h1 align="left">CORGI</h1>
  <a href="https://github.com/AkaruDev/nuxt-3-templates/tree/features/corgi">
    <img src="https://source.unsplash.com/random/320x320/?corgi" alt="Logo" width="160" height="160">
  </a>
</div>

<!-- ABOUT THE PROJECT -->
## About CORGI

Corgi, short for `core graphic interface` and also corgi the dog race, is a collection of composables and components to help the creation of 3D projects using Threejs on Nuxt 3.

[TODO] Add a description of the major features like useCorgi, CorgiCanvas, CorgiComponents

<p align="right">(<a href="#readme-top">back to top</a>)</p>


### Built With

* [![Nuxt][Nuxt]][Nuxt-url]
* [![Vue][Vue]][Vue-url]
* [![Vue][Three]][Three-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

The project is meant to work with [nuxt-3-templates-cli](https://github.com/AkaruDev/nuxt-3-templates-cli) to be installed in a Nuxt 3 project.
If you want to install it manually check the packages dependencies in [nuxt-templates-cli config file](/nuxt-templates-cli.js).
See the module playground example to see use case of the project.


<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

```
<!-- In a Vue component -->
<template>
  <canvas
    ref="canvas"
  />
</template>

<script setup>
const corgi = useCorgi(canvas)

onMounted(() => {
  // Your Threejs scene is ready and you can build your project here
})
</script>
```

For more examples, please refer to module playground folder

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## TODO
[ ] - Try generated doc from jsdoc

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Threejs journey by Bruno Simon](https://threejs-journey.com/)
* [OGL](https://github.com/oframe/ogl)
* [The book of shader](https://thebookofshaders.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[Nuxt]: https://img.shields.io/badge/Nuxt.js-35495E?style=for-the-badge&logo=nuxtdotjs&logoColor=4FC08D
[Nuxt-url]: https://nuxt.com/
[Vue]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Three]: https://img.shields.io/badge/Three.js-35495E?style=for-the-badge&logo=threedotjs&logoColor=4FC08D
[Three-url]: https://threejs.org/