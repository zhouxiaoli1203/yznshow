<template>
  <div>
    <div class="ruleList">
      <div v-for="(item,index) in rules" :key="index" class="rule">
        <div class="ruleInfo">
          <span class="rule-num">{{ item.number }}人团</span>
          <span class="rule-price">&yen;{{ item.price }}</span>
        </div>
      </div>
    </div>
    <p class="tips">达到最低梯度人数即刻成团，人数越多价格越低</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: ['rules'],
  // data() {
  //   return {
  //     rule: [
  //       {
  //         number: 2,
  //         price: 140000,
  //       },
  //       {
  //         number: 4,
  //         price: 100000,
  //       },
  //       {
  //         number: 10,
  //         price: 800,
  //       },
  //     ],
  //   };
  // },
  computed: {
    ...mapGetters([
      "getGroup"
    ]),
  },
  watch: {
    getGroup(val, newVal){
      
    }
  }
};
</script>

<style lang="less" scoped>
.ruleList {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.tips {
  font-size: 24px;
  color: #9c9c9c;
  text-align: center;
  line-height: 24px;
  margin-top: 14px;
}
.ruleInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .rule-num {
    background: url("../assets/bubble.png") center center/100% 100% no-repeat;
    text-align: center;
    // width: 92px;
    padding: 0 8px;
    height: 42px;
    font-size: 24px;
    &.active {
      background: url("../assets/bubbleAc.png") center center/100% 100%
        no-repeat;
    }
  }
  .rule-price {
    font-size: 26px;
    color: #23150c;
    text-align: center;
  }
}
.rule {
  display: flex;
  &:not(:last-child) {
    flex-grow: 1;
  }
}
.rule:not(:last-child)::after {
  content: "";
  display: block;
  flex-grow: 1;
  height: 20px;
  border-bottom: 1px solid #e0e0e0;
  // content: "";
  // display: inline-block;
  // position: absolute;
  // height: 14px;
  // width:  14px;
  // transform: rotate(45deg) translateX(-6px) translateY(54px);
  // border: solid #D8D8D8;
  // border-width: 0 1px 1px 0;
}
</style>