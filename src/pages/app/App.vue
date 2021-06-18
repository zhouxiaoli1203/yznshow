<template>
  <div id="app">
    <transition :name="SkipSwitchName">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" class="page"></router-view>
      </keep-alive>
    </transition>
    <transition :name="SkipSwitchName">
      <router-view v-if="!$route.meta.keepAlive" class="page"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      SkipSwitchName: "",
    };
  },
  watch: {
    $route(to, from) {
      if (to.meta.index > from.meta.index) {
        this.SkipSwitchName = "slide-left";
      } else {
        this.SkipSwitchName = "slide-right";
      }
    },
  }
};
</script>
<style lang="less" scoped>
#app {
  width: 100%;
  height: 100%;
  img {
    -webkit-touch-callout: none;
  }
  > div {
    width: 100%;
    min-height: 100%;
  }
}
.page {
  position: absolute;
  width: 100%;
  transition: all 0.8s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}
</style>



