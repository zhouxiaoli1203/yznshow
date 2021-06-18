<template>
  <div>
    <div class="track">
      <div
        class="current_help"
        :class="[type && precent == 100 ? 'complete' : '']"
        :style="{ width: precent + '%' }"
        v-if="type"
      >
      <van-icon class="success" v-if="precent == 100" name="success" />
      </div>
      <div
        v-else
        class="current_bargain"
        :class="[!type && precent == 100 ? 'complete' : '']"
        :style="{ width: precent + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "myProgress",
  data() {
    return {
      reup: {},
    };
  },
  props: {
    precent: {
      type: Number | String,
    },
    type: {
      type: Boolean,
    },
  },
  watch: {},
  methods: {},
};
</script>

<style  lang="less" scoped>
.track {
  margin-top:10px;
  width: 100%;
  position: relative;
  background-color: #eeefef;
  height: 8px;
  border-radius: 2px;
  .current_bargain {
    &.complete {
      &:after {
        content: "底";
        display: block;
        width: 18px;
        height: 18px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -8px;
        background: none;
        background-color: #14d3d3;
        text-align: center;
        line-height: 18px;
        border-radius: 50%;
        color: #fff;
        font-size: 11px;
      }
    }
    &:after {
      content: "";
      display: block;
      width: 18px;
      height: 34px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -8px;
      background: url("../../../assets/img/app/progress.png") no-repeat;
      background-size: contain;
    }
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: -moz-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #00b0b0),
      color-stop(100%, #19dcdc)
    );
    background: -webkit-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: -o-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: -ms-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: linear-gradient(to right, #00b0b0 0%, #19dcdc 100%);
  }

  .current_help {
    &.complete {
      .success{
        display: block;
        width: 18px;
        height: 18px;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: -8px;
        background: none;
        background-color: #14d3d3;
        text-align: center;
        line-height: 18px;
        border-radius: 50%;
        color: #fff;
        font-size: 11px;
        z-index: 1;
      }
    }
    &:after {
      content: "助";
      display: block;
      width: 18px;
      height: 18px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -8px;
      background: none;
      background-color: #14d3d3;
      text-align: center;
      line-height: 18px;
      border-radius: 50%;
      color: #fff;
      font-size: 11px;
    }
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: -moz-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #00b0b0),
      color-stop(100%, #19dcdc)
    );
    background: -webkit-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: -o-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: -ms-linear-gradient(left, #00b0b0 0%, #19dcdc 100%);
    background: linear-gradient(to right, #00b0b0 0%, #19dcdc 100%);
  }
}
</style>
