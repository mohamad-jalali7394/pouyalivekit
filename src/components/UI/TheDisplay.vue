<template>
  <div class="display">
    <video
        class="display__inner"
        :srcObject="videoStream"
        autoplay
        playsinline
    >
    </video>
  </div>
</template>

<script>
export default {
  name: "TheDisplay",
  props: ["videoStream"],
  data() {
    return {};
  },
};
</script>

<style scoped>
.display {
  position: relative;
  width: 35rem;
  display: flex;
  justify-content: center;
  align-items: center;
  top: -1.2rem;
}
.display__inner {
  width: 100%;
  height: 100%;
  object-fit:cover;
  border-radius: 1rem;
  transform: rotateY(180deg);
  -webkit-transform:rotateY(180deg); /* Safari and Chrome */
  -moz-transform:rotateY(180deg); /* Firefox */
}
@media (max-width:480px) {
  .display {
    width: 32rem;
    height: 23rem;
    padding:0;
  }
}
</style>
