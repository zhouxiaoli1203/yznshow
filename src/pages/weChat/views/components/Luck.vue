<template>
  <div class="dp-wrap"  @click.stop>
    <ul class="u-wrap">
      <li
        v-for="(jp, index) in jpList"
        :key="jp.code"
        :class="[{ active: jpIndex == index }, 'li-w-' + index]"
      >

        <!-- <img :src="jp.requireUrl" /> -->
      </li>
      <!-- 将抽奖按钮放在最后一位 -->
      <!-- <li class="now-w" @click="onStart"></li> -->
    </ul>
  </div>
</template>

<script>
const JP_OPTIONS = [
  {
    code: "1",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "2",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "3",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "4",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "5",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "6",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "7",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  },
   {
    code: "8",
    name: "奖品1",
    imageName: "1", //换上自己的img name
  }
];
import luck from '@/utils/luck.js'
export default {
  data() {
    // let jpList = JP_OPTIONS.map((item) => {
    //   item.requireUrl = require(`@/assets/${item.imageName}.png`); //加载本地的资源文件并转成base64
    //   return item;
    // });
    return {
      jpList: JP_OPTIONS,
      jpIndex: 0, //抽奖开始项
    };
  },
  methods: {
    onStart(n) {
      luck.init(this.jpList.length, this.jpIndex);
      const test = n; //test就是我们后端返回的中奖项code，现在我们模拟让他是5
      luck.prize = this.jpList.findIndex((item) => item.code === test); //匹配到我们的中奖项
      luck.code = test;
      luck.speed = 100;
      this.roll();
    },
    roll() {
      luck.times += 1;
      this.jpIndex = luck.roll();
      if (luck.times > luck.cycle + 10 && luck.prize == luck.index) {
        clearTimeout(luck.timer);
        luck.prize = luck.prize;
        luck.times = 0;
        console.log('jieshu')
        this.$emit('rollEnd')
        //已经中奖啦，这个时候就可以做我们中奖后的事情啦。。。
      } else {
        if (luck.times < luck.cycle) {
          luck.speed -= 10;
        } else if (luck.times == luck.cycle) {
          luck.prize = luck.prize; //最终中奖位置
        } else {
          if (
            luck.times > luck.cycle + 10 &&
            ((luck.prize == 0 && luck.index == 7) ||
              luck.prize == luck.index + 1)
          ) {
            luck.speed += 110;
          } else {
            luck.speed += 20;
          }
        }
        if (luck.speed < 40) {
          luck.speed = 40;
        }
        luck.timer = setTimeout(this.roll, luck.speed);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.li-w(@gcs, @gce, @grs, @gre) {
  grid-column-start: @gcs;
  grid-column-end: @gce;
  grid-row-start: @grs;
  grid-row-end: @gre;
}

.dp-wrap {
  margin-top: 30%;
  margin-left: 12px;
  width: 334px;
  height: 257px;
  position: absolute;
  top: 0.4rem;
  left: 0.4rem;
  right: 0.4rem;
  // height: 6.82rem;
  // background: url("~@/assets/win.png");
  background:url("~@/assets/img/weChat/helpRes.png");;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 0.34rem 0.34rem 0.52rem 0.34rem;
  box-sizing: border-box;
  .u-wrap {
    width: 255px;
    margin-left: 21px;
    display: grid;
    margin-top: 78px;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 0.04rem 0.04rem;
    .active {
      // background: url("~@/assets/win.png");
      // background: cornflowerblue !important;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
    > li {
      height: 37px;
      // background: url("~@/assets/win.png");
      // background: chocolate;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: grid;
      grid-auto-flow: row;
      justify-content: center;
      justify-items: center;
      align-content: center;
      padding: 0.2rem 0 0.32rem;
      > p {
        font-size: 0.2rem;
        color: #3d79f3;
        margin-top: 0.14rem;
        text-align: center;
      }
      > img {
        // width: 100%;
        max-height: 0.94rem;
      }
    }

    >li:nth-child(1) {
      background: url("~@/assets/img/luck/1.png") center center/100% 100% no-repeat;
      &.active {
        background: url("~@/assets/img/luck/11.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(2) {
       background: url("~@/assets/img/luck/2.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/12.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(3) {
       background: url("~@/assets/img/luck/3.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/13.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(4) {
       background: url("~@/assets/img/luck/4.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/14.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(5) {
       background: url("~@/assets/img/luck/5.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/15.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(6) {
       background: url("~@/assets/img/luck/6.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/16.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(7) {
       background: url("~@/assets/img/luck/7.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/17.png") center center/100% 100% no-repeat;
      }
    }
    >li:nth-child(8) {
      background: url("~@/assets/img/luck/8.png") center center/100% 100% no-repeat;
      &.active {
         background: url("~@/assets/img/luck/18.png") center center/100% 100% no-repeat;
      }
    }
    // >li:nth-child(9) {
    //   background: url("~@/assets/img/luck/1.png");
    //   &.active {
    //      background: url("~@/assets/img/luck/1.png");
    //   }
    // }
    // >li:nth-child(10) {
    //    background: url("~@/assets/img/luck/1.png");
    //   &.active {
    //     background: url("~@/assets/img/luck/1.png");
    //   }
    // }
    /**/
    // .li-w-3 {
    //   .li-w(3, 4, 2, 3);
    // }
    // .li-w-4 {
    //   .li-w(3, 4, 3, 4);
    // }
    .li-w-4 {
      .li-w(4, 5, 2, 3);
    }
    .li-w-5 {
      .li-w(3, 4, 2, 3);
    }
    .li-w-6 {
      .li-w(2, 3, 2, 3);
    }
    .li-w-7 {
      .li-w(1, 2, 2, 3);
    }
    // .li-w-9 {
    //   .li-w(1, 2, 2, 3);
    // }
    .now-w {
      background: red;
      background-size: 100% 100%;
      background-repeat: no-repeat;
      .li-w(2, 3, 2, 4);
    }
  }
}
</style>