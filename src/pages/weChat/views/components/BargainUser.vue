<template>
  <div >
    <div class="bargain-user" v-for="(item, index) in joinList" :key="index" >
      <div class="connect">
        <img src="@/assets/img/weChat/barCon.png" alt="" />
        <img src="@/assets/img/weChat/barCon.png" alt="" />
      </div>
      <div class="bargain-title">
        <span class="left"></span>
        <span class="text">{{ title }}</span>
        <span class="right"></span>
      </div>
      <div class="bargain-list">
        <div
          v-for="(one,oIndex) in item.activityHelpList && item.activityHelpList.slice(0,5)"
          :key="one.id"
          class="bargain-item"
        >
          <div class="pic">
            <img :src="one.headimgurl" alt="" class="bar-img" />
            <img src="@/assets/img/weChat/no1.png" class="bar-no" v-if="oIndex == 0"/>
            <img src="@/assets/img/weChat/no2.png" class="bar-no"  v-if="oIndex == 1"/>
            <img src="@/assets/img/weChat/no3.png" class="bar-no" v-if="oIndex == 2" />
          </div>
          <div class="name">
            <span>{{ one.nickname }}</span>
            <span>{{ moment(one.createTime).format("MM-DD HH:mm") }}</span>
          </div>
          <div class="price">
            帮砍<b>{{ one.money }}</b
            >元
          </div>
        </div>
      </div>
      <div v-if="(!item.activityHelpList || !item.activityHelpList.length)" class="no-bargain">当前还没有朋友帮你砍价，快快邀请好友帮砍~</div>
      <div class="more" @click="showAll(index)" v-if="item.activityHelpList && item.activityHelpList.length > 5">查看全部>></div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    joinList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  mounted() {
    // console.log(this.joinList[0].activityHelpList, "sdssd");
  },
  data() {
    return {
      title: "砍价帮",
      // list: [
      //   {
      //     name: "小黑素的小白猫",
      //     img: "",
      //     time: "04-15 23:59",
      //     price: "14.56",
      //     id: 1,
      //   },
      // ],
    };
  },
  methods: {
    moment,
    showAll(index) {
      let arr = this.joinList[index].activityHelpList
      this.$emit('showLog', {
        type: 'bargain',
        list: arr
      })
    }
  },
};
</script>

<style lang="less" scoped>
.connect {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  display: flex;
  padding: 0 10px;
  top: -30px;
  justify-content: space-between;
  img {
    width: 10px;
    height: 40px;
  }
}
.no-bargain {
  font-size: 13px;
  text-align: center;
  color: #BFBFBF;
}
.bargain-user {
  position: relative;
  padding-top: 4px;
  padding-bottom: 10px;
  margin: 0 8px;
  background: #fff;
  border-top: 1px dotted #f2ebeb;
  margin-bottom: 14px;
  border-radius: 4px;
  .more {
    color: #777777;
    font-size: 13px;
    line-height: 30px;
    text-align: center;
  }
}

.bargain-title {
  display: flex;
  font-size: 16px;
  color: #595959;
  margin-bottom: 8px;
  margin-top: 10px;
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

.bargain-list {
  overflow: hidden;
  .bargain-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
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
  }
  .bargain-item:last-child {
    margin-bottom: 10px;
  }
}
</style>