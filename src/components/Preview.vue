<template>
  <div
    :style="bgStyle"
    class="relative"
    :class="{ isTop: !getTopItem.url }"
    ref="pre"
  >
    <div style="position: relative">
      <img :src="getTopItem.url" class="topImg" />
      <active-title />
    </div>

    <div class="blank"></div>
    <div :key="index" v-for="(item, index) in packages" class="infoBlock">
      <package-name :nameInfo="item" />
      <content-custom
        :content="item.productDesc"
        v-if="(getActiveContent == 1 || getActiveType == 1) && item.productDesc"
      />
      <content-package
        :course="item.course"
        v-if="getActiveContent == 2 && item.course"
      />
      <content-package
        :course="item.courseInfo"
        v-if="getActiveContent == 2 && item.courseInfo"
      />
      <content-rule
        v-if="
          getActiveType == 3 &&
          item.showContentRuleList &&
          item.showContentRuleList.length > 1
        "
        :rules="item.showContentRuleList"
      />
    </div>
    <!-- 整体盒子 -->
    <div
      class="boxWrap"
      v-for="(item, index) in getContent"
      :key="'getContent_' + index"
    >
      <!-- 标题盒子 -->
      <div class="title" :style="title_style">
        <img
          style="width: 100%; display: block"
          :src="content.titleBackground"
        />
        <div class="titleContent" :style="titleZoom">
          <img :src="content.titleFrame1" alt="" ref="t1" style="left: 0" />
          <div class="titleTxt" :style="titleTxtStyle">{{ item.title }}</div>
          <img :src="content.titleFrame3" alt="" ref="t3" style="right: 0" />
        </div>
      </div>
      <!-- 内容盒子 -->
      <div class="box" :style="box_style">
        <div class="forBg"></div>
        <!-- 上 -->
        <div class="rowTop" :style="contentStyleTop">
          <div class="corner_l"></div>
          <div class="center"></div>
          <div class="corner_r"></div>
        </div>
        <!-- 中 -->
        <div class="rowCen">
          <div>
            <div v-for="(con, i) in item.body" :key="i">
              <div
                v-if="con.content"
                style="white-space: pre-line; word-break: break-all"
              >
                <span>{{ con.content }}</span>
              </div>
              <img :src="con.url" v-if="con.url" />
            </div>
          </div>
        </div>
        <!-- 下 -->
        <div class="rowBot" :style="contentStyleBottom">
          <div class="corner_l"></div>
          <div class="center"></div>
          <div class="corner_r"></div>
        </div>
      </div>
    </div>

    <div class="bottom-rule" >
      <p>本活动由易知鸟提供技术支持 >></p>
    </div>

    <div class="phone" :class="{ min: min_h }" @click="getShowPre">
      <div class="icon"></div>
      <span>预览</span>
    </div>

    <div class="rightBtns">
      <div
        class="rightFix music"
        v-if="getMusicItem.url"
        :class="{ paused: false }"
      ></div>
      <div class="rightFix yq" v-if="getDisSwitch">
        <img src="@/assets/img/weChat/invite.png" />
      </div>
      <div class="rightFix hb">
        <span>活动海报</span>
      </div>

      <div class="rightFix jg" v-if="getShopPhone">
        <a class="btn-call">
          <span>联系机构</span>
        </a>
      </div>
    </div>

    <a-modal
      :width="300"
      title="扫码预览"
      :footer="null"
      :closeIcon="null"
      :visible="showPhonePre"
      @cancel="showPhonePre = false"
    >
      <div class="prePhone">
        <qrcode-vue
          id="myCode"
          :value="
            BASEURL + '/show_h5/#/index?client=oa&terminal=pc&id=' + perSrcId
          "
        ></qrcode-vue>
      </div>
    </a-modal>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";
import ActiveTitle from "./ActiveTitle.vue";
import PackageName from "./PackageName.vue";
import ContentCustom from "./ContentCustom.vue";
import ContentPackage from "./ContentPackage.vue";
import ContentRule from "./ContentRule.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    music: {
      type: String,
      default: "https://cdntest.yizhiniao.com/1606197747963_13034.mp3",
    },
  },
  data() {
    return {
      showPhonePre: false,
      perSrcId: "",
      box_style: {},
      content: {},
      title_style: {},
      packages: [],
      bgStyle: {},

      titleZoom: {},
      titleTxtStyle: {},
      contentStyleTop: {},
      contentStyleBottom: {},
      isPaused: true,
      mp3: "",

      min_h: true,
    };
  },
  created() {
    this.initCss();
  },
  mounted() {
    this.getPackageValue();
    this.setBtnStyle()
  },
  methods: {
    setBtnStyle() {
      setTimeout(() => {
        let h = this.$refs.pre.clientHeight;
        let all_h = document.documentElement.clientHeight - 90;
        if (all_h > h) {
          this.min_h = true;
        } else {
          this.min_h = false;
        }
      }, 1000);
    },
    getPackageValue() {
      if (this.getActiveType == 1) {
        this.packages = [];
      }
      if (this.getActiveType == 2 && this.getActiveContent == 1) {
        this.packages = this.getFlashCustom;
      } else if (this.getActiveType == 2 && this.getActiveContent == 2) {
        this.packages = this.getPackages;
      } else if (this.getActiveType == 3 && this.getActiveContent == 2) {
        this.packages = this.getGroup;
      } else if (this.getActiveType == 3 && this.getActiveContent == 1) {
        this.packages = this.getGroupCustom;
      } else if (this.getActiveType == 4 && this.getActiveContent == 1) {
        this.packages = [this.getBargainCustom];
      } else if (this.getActiveType == 4 && this.getActiveContent == 2) {
        this.packages = [this.getBargain];
      } else if (this.getActiveType == 5 && this.getActiveContent == 1) {
        this.packages = [this.getHelpCustom];
      } else if (this.getActiveType == 5 && this.getActiveContent == 2) {
        this.packages = [this.getHelp];
      }
    },
    initCss() {
      this.bgStyle = {
        background: `url(${this.getBgItem.url})`,
      };
      this.headStyle = {
        background: `url(${this.getTopItem.url})`,
      };
      if (!this.getBlockItem.content) {
        return;
      }
    },

    // 设置区块样式
    setContentStyle() {
      let b = JSON.parse(this.getBlockItem.content);
      this.popImg = b.popPic;

      this.titleZoom = {};
      b.titleAlign == 1
        ? ((this.titleZoom["left"] = "50%"),
          (this.titleZoom["transform"] = "translateX(-50%)"))
        : (this.titleZoom["left"] = b.titleAlignDis * 2 + "px");

      //title主题top值
      this.titleZoom["top"] =
        Number((b.titleFrameMarginTop * 2) / 37.5) + "rem";
      this.titleZoom["--minWidth"] = (b.minWidth * 2) / 37.5 + "rem";
      this.titleZoom[
        "--background"
      ] = `url(${b.titleFrame2}) center center/auto 100%`;
      this.content = b;

      // 标题样式汇总
      this.title_style = {
        "--background": `url(${b.titleFrame2}) center center/auto 100%`,
        "--titlePadding": "0 " + (b.titleSides * 2) / 37.5 + "rem", //标题框左右padding值
        "--titleTop": Number((b.titleMarginTop * 2) / 37.5) + "rem ", //标题文字距顶高度
        "--titleColor": b.titleColor, //标题文字颜色
        "--titleSize": (b.titleFontsize * 2) / 37.5 + "rem", //标题字体大小
      };
      // box样式汇总
      this.box_style = {
        "margin-top": (b.frameMarginTop * 2) / 37.5 + "rem", //内容区块距顶
        "--contentFrame4": `url('${b.contentFrame4}') center center/100% repeat`, //左
        "--contentFrame5": `url('${b.contentFrame5}') center center/100% repeat`, //中
        "--contentFrame6": `url('${b.contentFrame6}') center center/100% repeat`, //右
        "--left": (-b.contentSizes * 2) / 37.5 + "rem",
        "--right": (-b.contentSizes * 2) / 37.5 + "rem",
        "--contentColor": b.contentColor, //文字颜色
        "--contentSize": (b.contentFontsize * 2) / 37.5 + "rem",
        //内容区块padding值
        padding:
          (b.contentMarginTop * 2) / 37.5 +
          "rem " +
          ((b.contentSizes * 2) / 37.5 + "rem ") +
          ((b.contentMarginBottom * 2) / 37.5 + "rem"),
      };

      this.titleTxtStyle = {
        "padding-top": Number((b.titleMarginTop * 2) / 37.5) + "rem",
        "font-size": (b.titleFontsize * 2) / 37.5 + "rem",
        color: b.titleColor,
      };

      this.contentStyleTop = {
        "--contentFrame_center": `url('${b.contentFrame2}') center center/100% 100%`,
        "--contentFrame3": `url('${b.contentFrame3}') center center/100% 100% no-repeat`,
        "--contentFrame1": `url('${b.contentFrame1}') center center/100% 100% no-repeat`,
      };
      this.contentStyleBottom = {
        "--contentFrame_center": `url('${b.contentFrame8}') center center/100% 100%`,
        "--contentFrame7": `url('${b.contentFrame7}') center center/100% 100%`,
        "--contentFrame9": `url('${b.contentFrame9}') center center/100% 100%`,
      };
    },
    getShowPre() {
      this.getPrePhone().then((res) => {
        this.perSrcId = res;
        this.showPhonePre = true;
      });
    },

    audioAutoPlay() {},

    videoChange() {
      if (this.isPaused) {
        this.mp3.play();
        this.isPaused = false;
        localStorage.setItem("yzn_music", 1);
      } else {
        this.mp3.pause();
        this.isPaused = true;
        localStorage.setItem("yzn_music", 2);
      }
    },
    toRule() {
      window.open("https://www.chosien.com/home#/Templates?id=8", "_blank");
    },
    ...mapActions("common", ["getPrePhone"]),
  },
  components: {
    ActiveTitle,
    PackageName,
    ContentCustom,
    ContentPackage,
    ContentRule,
    QrcodeVue,
  },
  computed: {
    ...mapGetters([
      "getContent",
      "getActiveType",
      "getActiveContent",
      "getLeaflet",
      "getPackages", // 抢购课程
      "getFlashCustom", // 抢购自定义
      "getGroup", // 拼团课程
      "getGroupCustom", // 拼团自定义
      "getBargainCustom", // 砍价自定义
      "getBargain",
      "getHelp",
      "getHelpCustom",

      "getBgItem",
      "getBlockItem",
      "getTopItem",

      "getMusicItem",
      "getDisSwitch",
      "getShopPhone",
      "getSystemType",
    ]),
  },
  watch: {
    getActiveType(val) {
      this.getPackageValue();
    },
    getContent () {
       this.setBtnStyle()
    },
    packages:{
      handler: function() {
        this.setBtnStyle()
      },
      deep: true
    },

    getActiveContent(val) {
      this.getPackageValue();
    },
    getLeaflet() {
      this.getPackageValue();
    },
    getFlashCustom() {
      this.getPackageValue();
    },
    getPackages() {
      this.getPackageValue();
    },
    getGroupCustom() {
      this.getPackageValue();
    },
    getGroup() {
      this.getPackageValue();
    },
    getBargainCustom() {
      this.getPackageValue();
    },
    getBargain() {
      this.getPackageValue();
    },
    getHelpCustom() {
      this.getPackageValue();
    },
    getHelp() {
      this.getPackageValue();
    },

    getBgItem() {
      this.initCss();
    },
    getTopItem() {
      this.initCss();
    },
    getBlockItem() {
      this.setBtnStyle()
      this.setContentStyle();
    },
  },
};
</script>

<style lang="less" scoped>
.boxWrap {
  position: relative;
  width: 710px;
  min-height: 200px;
  margin: 0 auto;
  overflow: auto;
  .title {
    width: 710px;
    left: 50%;
    position: absolute;
    top: 0;
    transform: translateX(-50%);
    z-index: 2;
    .titleContent {
      display: flex;
      width: fit-content;
      img {
        zoom: 0.5;
      }
      .titleTxt {
        min-width: var(--minWidth);
        background: var(--background);
        display: flex;
        justify-content: center;
        padding: var(--titlePadding);
      }
      position: absolute;
      top: var(--titleTop);
    }
  }
  .box {
    width: 100%;
    min-height: 100%;
    position: relative;
    &::before {
      content: "";
      width: 100px;
      background: var(--contentFrame4);
      position: absolute;
      left: 0;
      top: 100px;
      bottom: 100px;
    }
    &::after {
      content: "";
      width: 100px;
      background: var(--contentFrame6);
      right: 0;
      top: 0;
      position: absolute;
      top: 100px;
      bottom: 100px;
    }
    .forBg {
      position: absolute;
      top: 100px;
      left: 100px;
      bottom: 100px;
      right: 100px;
      background: var(--contentFrame5);
    }
    .rowCen {
      position: relative;
      z-index: 1;
      padding-top: var(--paddingtop);
      padding-bottom: var(--paddingbottom);
      text-align: justify;
      span {
        color: var(--contentColor);
        font-size: var(--contentSize);
      }
      img {
        width: 100%;
        display: block;
      }
    }
    .rowTop {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100px;
      .corner_l {
        width: 100px;
        height: 100px;
        background: var(--contentFrame1);
        position: absolute;
        top: 0;
        left: 0;
      }
      .corner_r {
        width: 100px;
        height: 100px;
        background: var(--contentFrame3);
        position: absolute;
        right: 0;
        top: 0;
      }
      .center {
        top: 0;
        left: 50%;
        background: var(--contentFrame_center);
        transform: translateX(-50%);
        width: calc(100% - 198px);
        height: 100%;
        position: absolute;
      }
    }
    .rowBot {
      bottom: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100px;
      .corner_l {
        width: 100px;
        height: 100px;
        background: var(--contentFrame7);
        position: absolute;
        top: 0;
        left: 0;
      }
      .corner_r {
        width: 100px;
        height: 100px;
        background: var(--contentFrame9);
        position: absolute;
        right: 0;
        top: 0;
      }
      .center {
        bottom: 0;
        left: 50%;
        background: var(--contentFrame_center);
        transform: translateX(-50%);
        width: calc(100% - 198px);
        height: 100%;
        position: absolute;
      }
    }
  }
}
.isTop {
  padding-top: 100px;
}
.relative {
  box-shadow: 0px 2px 10px 0px #dadada;
  overflow: hidden;
  position: relative;
}
.background {
  // object-fit: cover;
  // z-index: -10;
  position: absolute;
  top: 0;
  width: 750px;
}
.topImg {
  width: 750px;
}
.blank {
  margin-top: 140px;
}
.infoBlock {
  width: 718px;
  margin: 0 auto 20px;

  background: #ffffff;
  box-shadow: 0px 2px 4px 0px #fbe2a4;
  border-radius: 8px;
  min-height: 200px;
  padding: 36px 20px 12px 20px;

  display: flex;
  flex-direction: column;
}

.detail {
  position: relative;
  overflow: hidden;
  margin-bottom: 51px;
  > div {
    margin-top: 10px;
    overflow: hidden;
  }
}
.bottom-rule {
  margin-top: 32px;
  color: #fff;
  font-size: 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 80px;
  > div {
    margin-bottom: 18px;
    width: 136px;
    border: 2px solid #fff;
    border-radius: 8px;
    // margin-top: 16px;
    padding: 4px 0;
  }
  .content {
    width: 670px;
    margin: auto;
    text-align: left;
    padding: 0 40px;
    border: none;
  }
}
.phone {
  cursor: pointer;
  height: 80px;
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 18px;
  width: 750px;
  z-index: 998;

  &.min {
    position: inherit;
    bottom: 0;
  }

  .icon {
    background: url("~@/assets/phone.png") center center/ 100% 100% no-repeat;
    width: 24px;
    height: 34px;
  }
  span {
    font-size: 28px;
    color: #1f1f1f;
    margin-left: 10px;
  }
}
.prePhone {
  height: 220px;
  margin: 80px 0;
  #myCode {
    text-align: center;
    width: 200px;
    height: 200px;
    margin-left: 50%;
    transform: translateX(-50%);
  }
}

.rightBtns {
  position: absolute;
  right: 20px;
  top: 108px;
  z-index: 280;
}
.rightFix {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: linear-gradient(169deg, #fb8011 0%, #f54907 100%);
  text-align: center;
  margin-bottom: 20px;
  span {
    line-height: 1.2;
    margin-top: 14px;
    width: 56px;
    font-size: 11px;
    display: inline-block;
    color: #fff;
  }
  &.hb {
    background: rgba(30, 30, 30, 0.75);
  }
  &.jg {
    background: rgba(30, 30, 30, 0.75);
  }
  &.music {
    background: url("~@/assets/img/weChat/musicPlay.png") center center/150%
      150% no-repeat;
    animation: spin 3s linear infinite;
    &.paused {
      background: url("~@/assets/img/weChat/musicEnd.png") center center/150%
        150% no-repeat;
      animation: normal;
    }
  }
  &.yq {
    img {
      width: 100%;
      top: 160px;
    }
    top: 160px;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
