<template>
  <div class="choiceImg">
    <div class="head">
      <a-icon type="close" class="close" @click="close" />
      <span v-if="type == 1">选择顶部图</span>
      <span v-if="type == 3">选择区块样式</span>
      <span v-if="type == 0">选择背景图</span>
    </div>
    <div class="body">
      <div
        :style="{
          background: `url(${item.fileUrl}) center center/100% 100% no-repeat`,
        }"
        class="imgs"
        v-for="item in list"
        :key="item.libId"
        :class="[
          { curImg: item.libId == current },
          { top: type !== 0 },
          { bg: type === 0 },
        ]"
      >
        <div class="hoverBtn" @click="choiceOne(item)">
          <span v-if="item.libId == current">取消</span>
          <span v-else>选择</span>
        </div>
        <div v-if="item.libId == current" class="curTag">当前使用</div>
      </div>
    </div>
    <!-- <a-button type="primary" class="submit" @click="submit">确定</a-button> -->
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    type: {
      default: 1,
    },
  },
  data() {
    return {
      list: [],
      current: "",
      //firstChoice: {},
    };
  },
  created() {
    let curChoice
    if (this.type === 1) {
      curChoice = this.getTopItem;
    } else if (this.type === 0) {
      curChoice = this.getBgItem;
    } else if (this.type === 3) {
      curChoice = this.getBlockItem;
    }
    
    let url = "";
    if (this.getSystemType == 1) {
      url = "api/admin/show/listLib";
    } else if (this.getSystemType == 2) {
      url = "api/oa/show/listLib";
    }
    this.yznReq("get", url, {
      fileType: this.type,
      start: 0,
      count: 100
    }).then((res) => {
      if (res.status == 200) {
        this.list = res.context.items.filter((i) => i.status);
        this.current = curChoice && curChoice.id;
        console.log(this.current, 'cccur')
      }
    });
  },
  methods: {
    close() {
      // if (this.type === 1) {
      //   this.setTopItem({ ...this.firstChoice, type: 1 });
      // } else if (this.type === 0) {
      //   this.setBgItem({ ...this.firstChoice, type: 1 });
      // } else if (this.type === 3) {
      //   this.setBlockItem({ ...this.firstChoice, type: 1 });
      // }
      this.$parent.oncloseChoice();
    },
    choiceOne(item) {
      let type;
      if (this.current == item.libId) {
        this.current = "";
        type = 2;
      } else {
        this.current = item.libId;
        type = 1;
      }
      if (this.type === 1) {
        this.setTopItem({
          id: item.libId,
          url: item.fileUrl,
          color: item.topColor,
          type
        });
        this.setShareImageUrl(item.fileUrl);
      } else if (this.type === 0) {
        this.setBgItem({
          id: item.libId,
          url: item.fileUrl,
          type,
        });
      } else if (this.type === 3) {
        this.setBlockItem({
          id: item.libId,
          content: item.content,
          url: item.fileUrl,
          type,
        });
      }
    },
    // submit() {
    //   this.$parent.oncloseChoice();
    // },
    ...mapMutations("common", ["setTopItem", "setBlockItem", "setBgItem", "setShareImageUrl"]),
  },
  computed: {
    ...mapGetters([
      "getTopItem",
      "getBlockItem",
      "getBgItem",
      "getInfo",
      "getSystemType",
    ]),
  },
};
</script>

<style lang="less" scoped>
.choiceImg {
  min-height: calc(100vh - 40px);
  max-height: calc(100vh - 40px);
  overflow-y: scroll;
  width: 810px;
  background: #fff;
  position: fixed;
  z-index: 300;
  top: 40px;
  box-shadow: -4px 1px 6px 0px rgba(241, 241, 241, 0.5);

  .head {
    position: fixed;
    z-index: 111;
    height: 62px;
    border-bottom: 1px solid #f0f0f0;
    background: #fff;
    display: flex;
    width: 810px;
    .close {
      font-size: 20px;
      line-height: 62px;
      margin-left: 36px;
    }
    span {
      margin-right: 61px;
      flex-grow: 1;
      text-align: center;
      font-size: 16px;
      line-height: 62px;
    }
  }
  .body {
    display: flex;
    background: #fff;
    border-bottom: 1px solid #f2f2f2;
    // margin: 24px 43px 34px;
    margin: 75px 8px 10px 34px;
    flex-wrap: wrap;
  }
  .imgs {
    height: 50%;
    margin-bottom: 16px;
    position: relative;
    box-sizing: border-box;
    border: 1px solid transparent;
    img {
      padding-top: 50%;
      width: 100%;
    }
    .hoverBtn {
      display: none;
    }
    &:hover {
      .hoverBtn {
        display: block;
        position: absolute;
        bottom: 8px;
        left: calc(50% - 43px);
        width: 86px;
        height: 28px;

        background: rgba(43, 43, 43, 0.8);
        box-shadow: -4px 1px 6px 0px rgba(241, 241, 241, 0.5);
        border-radius: 4px;
        color: #48ecec;
        text-align: center;
        line-height: 28px;
        cursor: pointer;
      }
    }
    .curTag {
      width: 81px;
      height: 30px;
      background: #242626;
      border-radius: 2px;
      color: #fff;
      line-height: 30px;
      text-align: center;
      position: absolute;
      top: 0;
      left: 0;
    }
    &.curImg {
      border: 1px solid #1ed1d1;
      // &:hover {
      //   .hoverBtn {
      //     display: none;
      //   }
      // }
    }
    &.top {
      // width: calc(50% - 8px);
      // padding-top: calc(25% - 8px);
      width: calc(33.3% - 26px);
      padding-top: calc(33.3% - 26px);
      margin-right: 26px;
      border-radius: 10px;
      // &:nth-child(odd) {
      //   margin-right: 16px;
      // }
    }
    &.bg {
      width: calc(33% - 16px);
      padding-top: calc(66% - 16px);
      margin-right: 10px;
      // &:nth-child(even) {
      //   margin-right: 16px;
      //   margin-left: 16px;
      // }
    }
  }
  .submit {
    width: 125px;
    height: 40px;
    background: #13c2c2;
    border-radius: 4px;
    font-size: 20px;
    margin-left: 50%;
    transform: translateX(-62px);
    margin-bottom:10px;
  }
}
</style>