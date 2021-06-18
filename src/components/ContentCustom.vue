<template>
  <div class="content">
    <!-- :class="{ show: list[index] != true && type != 'pc' }" -->
    <div
      v-html="content"
      class="item-content"
      ref="itemContent"
      :class="{ hide: !isOpen, show: isOpen }"
    ></div>
    <div class="arrow-block" @click="openAll" v-if="show">
      <a-icon type="down" class="arrow" v-if="!isOpen" />
      <a-icon type="up" class="arrow" v-if="isOpen" />
    </div>
    <!-- <div
      class="item-more"
      v-if="list[index] && type != 'pc'"
      @click="changeShowMore(index)"
    ></div> -->
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
      show: true,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.detailDom = this.$refs.itemContent;
      this.show = this.detailDom.clientHeight > 100;
      this.isOpen = false
    });
  },
  methods: {
    openAll() {
      this.isOpen = !this.isOpen;
    },
  },
  watch: {
    content:  function (val) {
      let o = this.isOpen
      this.show = true
      this.isOpen = true
      this.$nextTick(() => {
        this.detailDom = this.$refs.itemContent;
        this.show = this.detailDom.clientHeight > 100;
        this.isOpen = o
      });
    },
  },
};
</script>

<style lang="less" scoped>
.conte {
  margin-top: 10px;
}
.arrow-block {
  text-align: center;
}
.arrow {
  color: #474747;
  font-size: 26px;
}
.item-content {
  padding: 0 6px;
  white-space: pre-wrap;
  color: #9d9d9d;
  line-height: 48px;
  font-size: 24px;

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
    height: 28px;
    width: 28px;
    transform: rotate(45deg) translateX(-3px) translateY(15px);
    border: solid #474747;
    border-width: 0 1px 1px 0;
    vertical-align: -4px;
  }
}
</style>