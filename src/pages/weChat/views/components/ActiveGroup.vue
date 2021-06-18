<template>
  <div class="acGroup">
    <div class="group-title">
      <span class="left"></span>
      <span class="text">TA们正在拼</span>
      <span class="right"></span>
    </div>
    <div class="joins" v-if="acJoinList.length">
      <div class="join-list" v-for="(item, index) in showList" :key="index">
        <div class="head">
          <img :src="item && item.headimgurl" />
          <span>团长</span>
        </div>
        <div class="name">
          <span class="nick">{{ item.nickname }}</span>
          <span class="tot">{{ item.totalNumber }}人团</span>
        </div>
        <div class="tips">
          还差<b>{{ item.totalNumber - item.currentNumber }}</b
          >人
        </div>
        <div class="btns"  @click="toJoinComfirm(item)">去凑团</div>
      </div>
    </div>
    <div class="all-join" v-if="acJoinList.length > 3" @click="showAll">
      全部拼团 >>
    </div>
    <div class="join-tip" v-if="!acJoinList.length">快邀请好友一起拼团吧~</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ["acJoinList"],
  data() {
    return {
      showList: [],
    };
  },
  mounted() {
    this.showList = this.acJoinList.slice(0,3)
  },
  methods: {
    showAll() {
      this.$parent.showGroupLog = true
    },
    toJoinComfirm(item) {
      this.$emit("toJoinNow", {
        groupId: item.groupId,
        contentId: item.contentId,
      });
    }
  },
   computed: {
    
    ...mapGetters([
      "getSelectedStu",
      "getSelectedCourse",
      "getStuList",
      "getActiveType",
      "getActiveJoin",
      "getIndexPop",
      "getShopPhone",
    ]),
  },
};
</script>

<style lang="less" scoped>
.acGroup {
  background: #fff;
  margin: 16px 8px;
  border-radius: 4px;
  padding: 12px 10px 8px;
}
.group-title {
  display: flex;
  font-size: 16px;
  color: #595959;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  .left {
    width: 43px;
    height: 6px;
    background: url("../../../../assets/img/weChat/zuo.png") center center/100%
      100% no-repeat;
  }
  .right {
    width: 43px;
    height: 6px;
    background: url("../../../../assets/img/weChat/you.png") center center/100%
      100% no-repeat;
  }
  .text {
    padding: 0 9px;
  }
}
.joins {
  // display: flex;
  align-items: center;
  overflow: hidden;
  justify-content: center;

  .join-list {
    margin-bottom: 10px;
    border: 1px solid #f2ebeb;
    border-radius: 4px;
    display: flex;
    padding: 10px 10px 10px 16px;
    width: 339px;
    height: 64px;
    box-sizing: border-box;
    .head {
      box-sizing: border-box;
      width: 40px;
      height: 40px;
      line-height: 1;
      position: relative;
      margin-right: 10px;
      img {
        width: 40px;
        height: 40px;
        border: 1px solid #fba233;
        border-radius: 50%;
      }
      span {
        text-align: center;
        bottom: -3px;
        left: 0px;
        right: 0;
        margin: 0 auto;
        border-radius: 8px;
        position: absolute;
        background: #fba233;
        width: 35px;
        height: 16px;
        font-size: 10px;
        color: #ffffff;
        line-height: 16px;
      }
    }
    .name {
      //flex-grow: 1;
      width: 138px;
      margin-right: 5px;
      display: flex;
      flex-direction: column;
      .nick {
        font-size: 15px;
        color: #262626;
        margin-bottom: 4px;
        overflow: hidden;
      }
      .tot {
        font-size: 13px;
        color: #595959;
      }
    }
    .tips {
      margin-right: 8px;
      font-size: 13px;
      color: #262626;
      line-height: 42px;
      b {
        color: #dc2a2a;
        font-weight: normal;
      }
    }
    .btns {
      align-items: flex-end;
      width: 56px;
      height: 24px;
      border-radius: 2px;
      border: 1px solid #bfbfbf;
      color: #dc2a2a;
      line-height: 24px;
      font-size: 13px;
      text-align: center;
      margin-top: 9px;
    }
  }
}
.join-tip {
  color: #b3b3b3;
  font-size: 13px;
  text-align: center;
}
.all-join {
  color: #dc2f2f;
  font-size: 14px;
  text-align: center;
}
</style>