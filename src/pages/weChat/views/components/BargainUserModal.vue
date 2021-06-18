<template>
  <div class="bargain-list" @click.stop>
    <div class="help-log">
      <div class="h-tit">
        <van-icon name="cross" @click.stop="showLogClose" />
        <span v-if="type == 'group'">我的团友</span>
        <span v-if="type == 'bargain'">砍价帮</span>
      </div>
      <div class="h-body">
        <div v-for="(item, index) in list" :key="item.id" class="bargain-item">
          <div class="pic">
            <img :src="item.headimgurl" alt="" class="bar-img" />
            <img
              src="@/assets/img/weChat/no1.png"
              class="bar-no"
              v-if="index == 0 && type == 'bargain'"
            />
            <img
              src="@/assets/img/weChat/no2.png"
              class="bar-no"
              v-if="index == 1 && type == 'bargain'"
            />
            <img
              src="@/assets/img/weChat/no3.png"
              class="bar-no"
              v-if="index == 2 && type == 'bargain'"
            />

            <span class="groupHead" v-if="type == 'group' && item.headFlag">团长</span>
          </div>
          <div class="name" :class="{'group': type=== 'group'}">
            <span>{{ item.nickname }}</span>
            <span v-if="type == 'bargain'">{{ moment(item.createTime).format("MM-DD HH:mm") }}</span>
          </div>
          <div class="price" v-if="type == 'bargain'">
            帮砍<b>{{ item.money }}</b
            >元
          </div>
          <div class="group-item" v-if="type == 'group'">
            {{ moment(item.createTime).format("YYYY-MM-DD HH:mm") }}
            <span v-if="item.headFlag">开团</span>
            <span v-else>参团</span>
          </div>
        </div>
      </div>
      <!-- v-if="type !== 'bargain-share'" -->
      <p v-if="type=='group' && (total - num) " class="group-tip">还差 <b>{{ total - num }}人</b> 拼团成功，快去邀请好友吧</p>
      <van-button
        color="linear-gradient(180deg, #FF5C0A 0%, #E42A02 100%)"
        @click="toShowShare"
      >
        <img src="@/assets/img/weChat/weixin.png" />
        <span v-if="type == 'bargain'">邀请好友砍价</span>
        <span v-if="type == 'group'">邀请好友拼团</span>
      </van-button>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    total: {
      type: Number,
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      // list: [
      //   {
      //     name: "小黑素的小白猫",
      //     img: "",
      //     time: "04-15 23:59",
      //     price: "14.56",
      //     id: 1,
      //   }
      num: '',
    };
  },
  methods: {
    moment,
    showLogClose() {
      this.$emit("showLogClose");
    },
    toShowShare() {
      this.$emit("toShowShare", {shareSty: 2});
    },
  },
  watch: {
    list: {
      handler: function (val, newVal) {
        if (this.type == 'group') {
          this.num = val && val.length
        }
      },
      deep: true
    }
  }
};
</script>

<style lang="less" scoped>
.group-tip {
  margin-top: 26px;
  margin-bottom: 8px;
  line-height: 18px;
  text-align: center;
  font-size: 13px;
  color: #23150C;
  b {
    color: #ff5c0a;
    font-weight: normal;
  }
}
.groupHead {
  text-align: center;
  bottom: -8px;
  left: 0px;
  right: 0;
  margin: 0 auto;
  border-radius: 8px;
  position: absolute;
  background: #fba233;
  width: 35px;
  height: 16px;
  font-size: 12px;
  color: #ffffff;
  line-height: 16px;
}
.bargain-list {
  overflow: scroll;
  margin-top: 100px;
  margin-bottom: 50px;
  .bargain-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 14px;
    margin-top: 10px;
    border-bottom: 1px solid #eed88d;
    .pic {
      margin-left: 16px;
      width: 40px;
      height: 40px;
      position: relative;
      .bar-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .bar-no {
        position: absolute;
        width: 33px;
        height: 12px;
        bottom: -6px;
        left: 3px;
      }
    }
    .name {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      color: #23150c;
      margin-left: 10px;
      :last-child {
        font-size: 11px;
        color: #777777;
      }
      &.group {
        span {
          font-size: 15px;
        color: #262626;
        }
        
      }
    }
    .price {
      color: #777777;
      font-size: 12px;
      margin-right: 18px;
      b {
        font-weight: normal;
        color: #dc2a2a;
      }
    }
    .group-item {
      margin-right: 16px;
      font-size: 12px;
    }
  }
}
.help-log {
  width: 335px;
  margin: 0 auto;
  background: #fff3cb;
  //padding-bottom: 4px;
  border-radius: 4px;
  .van-icon {
    font-size: 18px;
    margin-left: 17px;
    margin-top: 12px;
  }
  .h-tit {
    border-bottom: 1px solid #eed88d;
    span {
      line-height: 40px;
      text-align: center;
      display: inline-block;
      width: 270px;
      color: #23150c;
      font-size: 18px;
    }
  }
  .h-body {
    margin-bottom: 20px;
  }
}
.van-button {
  width: 100%;
  height: 40px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
    vertical-align: middle;
  }
}
</style>