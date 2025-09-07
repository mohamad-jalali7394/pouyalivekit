<template>
  <div
      :class="{
          'multimedia-sharing-fragment': !$store.getters.myInfo.amIMobile && !isSideBarVisible && !pdfShare,
          'multimedia-sharing-fragment-width-side-bar': !$store.getters.myInfo.amIMobile && isSideBarVisible && !pdfShare,
          'multimedia-sharing-fragment-pdf':pdfShare && !$store.getters.myInfo.amIMobile && !isSideBarVisible,
          'multimedia-sharing-pdf-fragment-width-side-bar': pdfShare && !$store.getters.myInfo.amIMobile && isSideBarVisible,
          'multimedia-sharing-fragment-pdf--mobile':pdfShare && $store.getters.myInfo.amIMobile,
          'multimedia-sharing-fragment__mobile':!pdfShare && $store.getters.myInfo.amIMobile
        }"
      ref="multimedia-sharing-fragment">
    <slot></slot>
  </div>

</template>

<script>
export default {
  name: "MultimediaSharingFragment",
  props:['pdfShare','isMobile','isSideBarVisible']

}
</script>

<style scoped>
.multimedia-sharing-fragment{
  width: calc(100% - 40rem);
  height: 98%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
}
.multimedia-sharing-fragment-width-side-bar{
  width: calc(100% - 73rem);
  height: 98%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
}
.multimedia-sharing-fragment__mobile{
  width: 98%;
  height: 40%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto auto;
}
.multimedia-sharing-fragment-pdf{
  width: 300vw;
  height: 98%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.multimedia-sharing-fragment-pdf{
  width: calc(300vw - 38rem);
  height: 98%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
.multimedia-sharing-fragment-pdf--mobile{
  width: 100vw;
  height: 50%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
@media (max-width: 1280px) {
  .multimedia-sharing-fragment{
    width: calc(100% - 35rem);
    height: 98%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto auto;
  }
  .multimedia-sharing-fragment-width-side-bar{
    width: calc(100% - 68rem);
    height: 98%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto auto;
  }
}
</style>
