<template>
  <div class="content">
    <div
      class="item-content"
      ref="itemContent"
      v-html="content"
      :class="{  hide: !isOpen }"
    ></div>
    <div class="arrow-block" @click="openAll" v-if="show">
      <van-icon name="arrow-down" class="arrow" v-if="!isOpen" />
      <van-icon name="arrow-up" class="arrow" v-if="isOpen" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isOpen: true,
      show: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.detailDom = this.$refs.itemContent;
      this.show = this.detailDom.clientHeight > 110;
      this.isOpen = false
    });
  },
  methods: {
    openAll() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style lang="less" scoped>
.arrow-block {
  text-align: center;
}
.arrow {
  color: #474747;
  font-size: 18px;
}
.content {
  // border-bottom: 1px solid #f2ebeb;
  margin-bottom: 10px;
  margin-top: 10px;
}
.item-content {
  padding: 0 3px;
  white-space: pre-wrap;
  color: #9d9d9d;
  line-height: 24px;
  font-size: 12px;

  &.show {
    -webkit-line-clamp: unset;
  }
  &.hide {
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4; /*要显示的行数*/
    -webkit-box-orient: vertical;
  }
}
.item-more {
  &::before {
    content: "";
    display: inline-block;
    position: absolute;
    left: 50%;
    height: 14px;
    width: 14px;
    transform: rotate(45deg) translateX(-1px) translateY(7px);
    border: solid #474747;
    border-width: 0 1px 1px 0;
    vertical-align: -2px;
  }
}
</style>