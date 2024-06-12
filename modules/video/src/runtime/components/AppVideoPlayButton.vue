<template>
  <div
    class="AppVideoPlayButton"
  >
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M14.735 9.16533C15.334 9.56057 15.334 10.4394 14.735 10.8347L1.80074 19.3691C1.13589 19.8078 0.250001 19.3309 0.250001 18.5344L0.250002 1.4656C0.250002 0.66905 1.13589 0.192228 1.80074 0.63092L14.735 9.16533Z" />
    </svg>
  </div>
</template>

<style scoped>
.AppVideoPlayButton {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: pointer;
}

.AppVideoPlayButton svg {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -15px;
  margin-left: -15px;
  fill: white;
}
</style>
