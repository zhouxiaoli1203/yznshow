<template>
  <div class="bg" @click.stop>
    <div div class="h-tit">
      <van-icon name="cross" @click.stop="showLogClose" />
      <span>TA们正在拼</span>
    </div>
    <div class="joins" v-if="acJoinList.length">
      <div class="join-list" v-for="(item, index) in acJoinList" :key="index">
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
        <div class="btns" @click="toJoinComfirm(item)">去凑团</div>
      </div>
    </div>
    <div class="join-tip" v-if="!acJoinList.length">快邀请好友一起拼团吧~</div>
  </div>
</template>

<script>
export default {
  props: {
    acJoinList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    showLogClose() {
      this.$emit("groupLogClose");
    },
    toJoinComfirm(item) {
      this.$emit('toJoinComfirm', item)
    }
  },
};
</script>

<style lang="less" scoped>
.bg {
  overflow: scroll;
  background: #fff;
  width: 340px;
  margin: 100px auto 50px;
  border-radius: 4px;

  .h-tit {
    border-bottom: 1px solid #efefef;
    font-size: 18px;
    line-height: 40px;
    .van-icon {
      font-size: 18px;
      margin-left: 17px;
      margin-top: 12px;
    }
    span {
      line-height: 40px;
      text-align: center;
      display: inline-block;
      width: 270px;
      color: #23150c;
      font-size: 18px;
    }
  }
}
.joins {
  //display: flex;
  align-items: center;
  overflow: hidden;
  min-height: 60px;
  justify-content: center;
  .join-list {
    margin-bottom: 10px;
    
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
      width: 145px;
      margin-right: 5px;
      display: flex;
      flex-direction: column;
      .nick {
        font-size: 14px;
        color: #262626;
        margin-bottom: 4px;
        overflow: hidden;
      }
      .tot {
        font-size: 12px;
        color: #595959;
      }
    }
    .tips {
      margin-right: 8px;
      font-size: 12px;
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
      font-size: 12px;
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
</style>