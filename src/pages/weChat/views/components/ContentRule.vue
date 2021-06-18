<template>
  <div>
    <div class="ruleList">
      <div v-if="type == 1">
        <div v-for="(item, index) in rules" :key="index" class="rule">
          <div class="ruleInfo">
            <span
              class="rule-num"
              :class="{ active: index == rules.length - 1 }"
              >{{ item.number }}人团</span
            >
            <span
              class="rule-price"
              :class="{ active: index == rules.length - 1 }"
              >&yen;{{ item.price }}</span
            >
          </div>
        </div>
      </div>

      <div v-if="type == 2">
        <div
          v-for="(item, index) in rules"
          :key="index"
          class="rule-my"
          :class="{ active: index == currentIndex }"
        >
          <div class="ruleInfo-my">
            <span
              class="rule-num"
              :class="{
                active: index == currentIndex,
                prev: index < currentIndex,
                next: index > currentIndex,
              }"
              >{{ item.number }}人团</span
            >
            <span
              class="rule-price"
              :class="{
                active: index == currentIndex,
                prev: index < currentIndex,
                next: index > currentIndex,
              }"
              >&yen;{{ item.price }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <p class="tips">达到最低梯度人数即刻成团，人数越多价格越低</p>
  </div>
</template>

<script>
//  type 1  多学员  或者  未参加时候样式

//  type 2  单学员参加时样式
export default {
  props: ["rules", "type", "currentIndex"],
};
</script>

<style lang="less" scoped>
.ruleList > div {
  display: flex;
  // justify-content: space-between;
  margin-top: 5px;
  align-items: flex-start;
}
.tips {
  font-size: 12px;
  color: #9c9c9c;
  text-align: center;
  line-height: 12px;
  padding-bottom: 16px;
  margin-top: 12px;
  margin-bottom: 0;
}
.ruleInfo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  .rule-num {
    background: url("../../../../assets/bubble.png") center center/100% 100%
      no-repeat;
    text-align: center;
    //width: 46px;
    padding: 0 4px;
    height: 21px;
    line-height: 18px;
    font-size: 12px;
    &.active {
      background: url("../../../../assets/bubbleAc.png") center center/100% 100%
        no-repeat;
    }
  }
  .rule-price {
    font-size: 13px;
    color: #23150c;
    text-align: center;
    font-weight: 500;
    &.active {
      font-weight: 600;
      color: #dc2a2a;
      font-size: 16px;
    }
  }
}
.rule {
  display: flex;
  &:not(:last-child) {
    // flex-grow: 1;
  }
}
.rule:not(:last-child)::after {
  content: "";
  display: block;
  flex-grow: 1;
  height: 10px;
  width: 46px;
  border-bottom: 1px solid #e0e0e0;
}

.ruleInfo-my {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .rule-num {
    text-align: center;
    width: 46px;
    line-height: 18px;
    height: 21px;
    font-size: 12px;
    color: #797979;
     background: url("../../../../assets/img/weChat/pricePrev.png") center
        center/100% 100% no-repeat;
    &.active {
      width: 60px;
      height: 29px;
      line-height: 26px;
      background: url("../../../../assets/img/weChat/priceNow.png") center
        center/100% 100% no-repeat;
      color: #fff;
    }
    &.prev {
      background: url("../../../../assets/img/weChat/pricePrev.png") center
        center/100% 100% no-repeat;
      color: #fff;
    }
    &.next {
      background: url("../../../../assets/bubble.png") center center/100% 100%
        no-repeat;
    }
  }
  .rule-price {
    font-size: 13px;
    color: #797979;
    text-align: center;
    font-weight: 500;
    &.active {
      font-weight: 600;
      color: #dc2a2a;
      font-size: 16px;
    }
    &.prev {
      color: #ff8869;
      font-size: 13px;
    }
    &.next {
      color: #797979;
      font-size: 13px;
    }
  }
}
.rule-my {
  display: flex;
  &:not(:last-child) {
    // flex-grow: 1;
  }
}
.rule-my:not(:last-child)::after {
  content: "";
  display: block;
  // flex-grow: 1;
  height: 10px;
  width: 46px;
  border-bottom: 1px solid #dc2a2a;
}
.rule-my.active .ruleInfo-my{
  position: relative;
  top: -3px;
}
</style>