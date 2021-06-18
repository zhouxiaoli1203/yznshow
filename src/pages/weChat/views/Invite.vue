<template>
  <div class="bg">
    <div>
      <img
        src="https://cdntest.yizhiniao.com/1606292890030_top.png"
        class="topImg"
      />
    </div>
    <template v-if="shareUrl">
      <qrcode-vue v-show="false" id="myCode" :value="shareUrl"></qrcode-vue>
    </template>
    <!-- 整体盒子 -->
    <div
      class="boxWrap"
      v-for="(item, index) in list"
      :key="'getContent_' + index"
    >
      <!-- 标题盒子 -->
      <div class="title">
        <div class="titleContent">
          <img
            src="../../../assets/img/weChat/invite/biaoti_1.png"
            style="left: 0"
          />
          <div class="titleTxt">{{ item.title }}</div>
          <img
            src="../../../assets/img/weChat/invite/biaoti_3.png"
            style="right: 0"
          />
        </div>
      </div>
      <!-- 内容盒子 -->
      <div class="box">
        <div class="forBg"></div>
        <!-- 上 -->
        <div class="rowTop">
          <div class="corner_l"></div>
          <div class="center"></div>
          <div class="corner_r"></div>
        </div>
        <!-- 中 -->
        <div class="rowCen">
          <div>
            <div v-for="(con, i) in item.body" :key="i">
              <div
                class="rowTxt"
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
        <div class="rowBot">
          <div class="corner_l"></div>
          <div class="center"></div>
          <div class="corner_r"></div>
        </div>
      </div>
    </div>

    <div class="mydata" v-if="activityInfo.referralRecord">
      <h2>我的邀请成果</h2>
      <div>
        <span class="f15">{{ activityInfo.referralRecord.views }}</span
        ><span class="f13">浏览人次</span>
      </div>
      <div>
        <span class="f15">{{ activityInfo.referralRecord.inviteNumber }}</span
        ><span class="f13">有效邀请</span>
      </div>
      <div>
        <span class="f15">{{
          activityInfo.referralRecord.recommendedNumber
        }}</span
        ><span class="f13">推荐报课</span>
      </div>
    </div>

    <div class="operateFixed">
      <template v-if="activityInfo.referralRecord">
        <div class="c_f_center" @click="showShare = true">
          <var></var>
          <span>立即邀请</span>
        </div>
        <div class="c_f_center" @click="getPost">
          <var></var>
          <span>生成邀请卡</span>
        </div>
      </template>
      <div class="c_f_center" v-else @click="join">
        <span>立即参与</span>
      </div>
    </div>
    <!-- 登录框 -->
    <van-dialog
      v-model="show"
      title="推荐人"
      :showConfirmButton="false"
      :closeOnClickOverlay="true"
    >
      <van-field
        v-model="sub.phone"
        label="手机号"
        type="digit"
        maxlength="11"
        placeholder="手机号"
      />
      <van-field
        v-model="sub.code"
        label="验证码"
        maxlength="4"
        type="digit"
        clearable
        placeholder="请输入验证码"
      >
        <template #button>
          <van-button
            :class="{ send: sec > 0 }"
            :disabled="sec > 0"
            size="small"
            color="#ff5c0a"
            plain
            class="sms"
            @click="sendSms"
            >{{ btnTxt }}</van-button
          >
        </template>
      </van-field>

      <van-button class="btn" @click="login" block>确认</van-button>
    </van-dialog>
    <van-overlay :show="showShare" @click="showShare = false" z-index="1994">
      <div class="share-wrapper">
        <img src="@/assets/img/weChat/yaoqing_.png" />
      </div>
    </van-overlay>
    <van-overlay :show="showImg" @click="showImg = false" z-index="1994">
      <div class="post-img">
        <img :src="img" @click.stop />
        <div class="photo-btn" @click.stop>长按图片保存至相册</div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import { yznReq } from "@/utils/yznhttp";
import { Toast } from "vant";
import { getShareData, getWxAuthorize } from "@/utils/utils.js";
import QrcodeVue from "qrcode.vue";
import { mapMutations, mapGetters } from 'vuex';
let timer;
export default {
  components: { QrcodeVue },
  data() {
    return {
      phonePattern: /^1\d{10}$/,
      show: false,
      showImg: false,
      showShare: false,
      list: [],
      activityInfo: {},
      shareUrl: "",
      btnTxt: "发送验证码",
      sec: 0,
      img: "",
      sub: {
        phone: "",
        code: "",
      },
    };
  },
  watch: {
    btnTxt: function (val, newVal) {
      if (val < 1) {
        timer = null;
      }
    },
  },
  mounted() {
    let referralDataId = this.$route.query.referralDataId;
    let id = this.$route.query.id;
    let from_openid = this.$route.query.url_openid;
    let client = this.$route.query.client;
    let groupId = this.$route.query.groupId;
    if (client) {
      // 不去授权
    } else {
      getWxAuthorize(id, from_openid, referralDataId, groupId, true);
    }
    if (localStorage.getItem(`yzn_show_phone${this.$route.query.id}`)) {
      this.generateReferral();
    }
    this.getDetail(this.configShare)
    
  },
  methods: {
    configShare(data) {
      this.shareUrl =
        this.BASEURL +
        "/show_h5/" +
        "#/index?id=" +
        this.$route.query.id +
        "&url_openid=" +
        localStorage.getItem("yzn_openid") +
        (data.referralRecord
          ? "&referralDataId=" + data.referralRecord.referralDataId
          : "");
      getShareData(
        "推荐你一个很棒的活动！",
        data.shareDesc,
        data.shareImageUrl,
        Object.assign(
          {
            activityId: this.$route.query.id,
            openid: localStorage.getItem("yzn_openid"),
          },
          data.referralRecord
            ? {
                referralDataId: data.referralRecord.referralDataId,
              }
            : {}
        )
      );
    },
    async sendSms() {
      if (!this.sub.phone) {
        return Toast("请输入手机号码");
      }
      if (!/^1\d{10}$/.test(this.sub.phone)) {
        return Toast("请输入正确手机号码");
      }
      let res = await yznReq("get", "/api/oa/referral/getAuthCode", {
        phoneNum: this.sub.phone,
      });
      if (res.status == 200) {
        this.sec = 60;
        this.btnTxt = `已发送${this.sec}s`;
        timer = setInterval(() => {
          this.sec--;
          if (this.sec == 0) {
            clearInterval(timer);
            this.btnTxt = "重新发送";
          } else {
            this.btnTxt = `已发送${this.sec}s`;
          }
        }, 1000);
      }
    },
    async login() {
      if (!this.sub.phone) {
        return Toast("请输入手机号码");
      }
      if (!/^1\d{10}$/.test(this.sub.phone)) {
        return Toast("请输入正确手机号码");
      }
      if (!this.sub.code) {
        return Toast("请输入验证码");
      }
      let res = await yznReq("get", "/api/oa/show/signIn", {
        phone: this.sub.phone,
        authCode: this.sub.code,
        activityId: this.$route.query.id,
        openid: localStorage.getItem("yzn_openid"),
      });
      if (res.status == 200) {
        this.show = false;
        this.registerStu({
          potentialCustomerParentPhone: this.sub.phone,
        });
        this.setSelectedStu({
          potentialCustomerParentPhone: this.sub.phone,
        });
        this.setActiveJoin({
          phoneNum: this.sub.phone
        })
        localStorage.setItem(`yzn_show_phone${this.$route.query.id}`, this.sub.phone);
        setTimeout(() => {
          this.generateReferral()
          this.getDetail(this.configShare);
        }, 0);
       
      }
    },
    async generateReferral () {
      await yznReq('post', 'api/oa/referral/generateReferral', {
        openid: localStorage.getItem("yzn_openid") || undefined,
        phoneNum: localStorage.getItem(`yzn_show_phone${this.$route.query.id}`),
        activityId: this.$route.query.id
      })
    },
    async getDetail(fn) {
      
      let res = await yznReq("get", "api/oa/show/detailH5", {
        activityId: this.$route.query.id,
        openid: localStorage.getItem("yzn_openid") || undefined,
      });
      if (res && res.status == 200) {
        fn && fn(res.context);
        this.activityInfo = res.context;
        if (res.context.distContent) {
          this.list = JSON.parse(res.context.distContent);
        }
      }
    },
    getPost() {
      this.makePost((src) => {
        this.img = src;
        this.showImg = true;
        console.log("图片生成成功");
      });
    },
    join() {
      if ( localStorage.getItem("yzn_openid") && localStorage.getItem(`yzn_show_phone${this.$route.query.id}`) ) {
        this.getDetail(this.configShare);
      } else {
        this.show = true;
        this.sub = {
          phone: "",
          code: "",
        };
      }
    },
    // 生成海报
    makePost(fn) {
      let that = this,
        userInfo = JSON.parse(localStorage.getItem("userInfo"));

      try {
        //圆角矩形
        function roundRect(context, x, y, w, h, r, fn, options) {
          context.save();
          if (w < 2 * r) r = w / 2;
          if (h < 2 * r) r = h / 2;
          context.moveTo(x + r, y);
          context.arcTo(
            x + w,
            y,
            x + w,
            y + h,
            !options || options.rightTop ? r : 0
          );
          context.arcTo(
            x + w,
            y + h,
            x,
            y + h,
            !options || options.rightBot ? r : 0
          );
          context.arcTo(x, y + h, x, y, !options || options.leftBot ? r : 0);
          context.arcTo(x, y, x + w, y, !options || options.leftTop ? r : 0);
          context.clip();
          if (fn) {
            fn();
            ctx.restore();
          }
        }
        function getCirclePic(ctx, x, y, r, pic, dx, dy, dWidth, dHeight) {
          //  x:圆心x轴位置
          //  y:圆心x轴位置
          //  r:圆半径
          //  pic:图片
          //  dx:图片左上角x轴位置
          //  dy:图片左上角y轴位置
          //  dWidth:图片的宽
          //  dHeight:图片的高
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.clip();
          ctx.drawImage(pic, dx, dy, dWidth, dHeight);
          ctx.restore();
        }
        function canvasTextAutoLine(str, canvas, initX, initY, lineHeight) {
          let ctx = canvas.getContext("2d");
          let lineWidth = 0;
          let canvasWidth = canvas.width;
          let lastSubStrIndex = 0;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          for (let i = 0; i < str.length; i++) {
            lineWidth += ctx.measureText(str[i]).width;
            if (lineWidth > (canvasWidth / 8) * 6.1) {
              ctx.fillText(
                str.substring(lastSubStrIndex, i),
                canvasWidth / 2,
                initY
              );
              initY += lineHeight;
              lineWidth = 0;
              lastSubStrIndex = i;
            }
            if (i == str.length - 1) {
              ctx.fillText(
                str.substring(lastSubStrIndex, i + 1),
                canvasWidth / 2,
                initY
              );
            }
          }
          return initY;
        }
        function convertCanvasToImage(canvas) {
          let img_ = new Image();
          img_.src = canvas.toDataURL("image/png", 1);
          return img_;
        }
        //默认canvas宽高为 300 * 430;
        let currentW = ((300 * 2) / 375) * document.documentElement.clientWidth,
          currentH = (currentW * 518 * 2) / (300 * 2),
          imgone = new Image(),
          imgQrcode = new Image(),
          imgHead = new Image(),
          zoom = document.documentElement.clientWidth / 375;
        let mycanvas = document.createElement("canvas"); //海报画布
        imgone.crossOrigin = "Anonymous";
        imgQrcode.crossOrigin = "Anonymous";
        imgHead.crossOrigin = "Anonymous";
        // 获取二维码地址
        imgQrcode = convertCanvasToImage(document.getElementById("myCode"));
        imgone.src = that.activityInfo.shareImageUrl;
        imgHead.src = userInfo.headimgurl;

        mycanvas.width = currentW;
        mycanvas.height = currentH;
        mycanvas.style.display = "none";
        let ctx = mycanvas.getContext("2d");
        let promiseAll = [
          new Promise(function (resolve, reject) {
            imgone.onload = function () {
              resolve(imgone);
            };
          }),
          new Promise(function (resolve, reject) {
            imgQrcode.onload = function () {
              resolve(imgQrcode);
            };
          }),
          new Promise(function (resolve, reject) {
            imgHead.onload = function () {
              resolve(imgHead);
            };
          }),
        ];

        Promise.all(promiseAll).then((item) => {
          roundRect(ctx, 0, 0, currentW, currentH, 4 * 2 * zoom, function () {
            // 白色背景
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, currentW, currentH);
          });
          // 微信头像
          getCirclePic(
            ctx,
            35 * 2 * zoom,
            36 * 2 * zoom,
            20 * 2 * zoom,
            imgHead,
            15 * 2 * zoom,
            16 * 2 * zoom,
            40 * 2 * zoom,
            40 * 2 * zoom
          );
          // 昵称
          ctx.fillStyle = "#282828";
          ctx.font = 12 * 2 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText(userInfo.nickname, 60 * 2 * zoom, 33 * 2 * zoom);

          ctx.fillStyle = "#AAA1A1";
          ctx.font = 11 * 2 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText(
            "我发现一个很棒的活动，邀请你一起来参加！",
            60 * 2 * zoom,
            51 * 2 * zoom
          );

          // 活动顶部图
          roundRect(
            ctx,
            15 * 2 * zoom,
            66 * 2 * zoom,
            270 * 2 * zoom,
            270 * 2 * zoom,
            4 * 2 * zoom,
            function () {
              ctx.drawImage(
                imgone,
                15 * 2 * zoom,
                66 * 2 * zoom,
                270 * 2 * zoom,
                270 * 2 * zoom
              );
            },
            {
              rightTop: true,
              leftBot: false,
              rightBot: false,
              leftTop: true,
            }
          );

          // 活动名称
          roundRect(
            ctx,
            15 * 2 * zoom,
            336 * 2 * zoom,
            270 * 2 * zoom,
            34 * 2 * zoom,
            4 * 2 * zoom,
            function () {
              ctx.fillStyle = "#FB9542";
              ctx.fillRect(
                15 * 2 * zoom,
                336 * 2 * zoom,
                270 * 2 * zoom,
                34 * 2 * zoom
              );
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "#fff";
              ctx.font = 13 * 2 * zoom + "px PingFang-SC-Heavy";
              ctx.fillText(
                that.activityInfo.activityName,
                currentW / 2,
                353 * 2 * zoom
              );
            },
            {
              rightTop: false,
              leftBot: true,
              rightBot: true,
              leftTop: false,
            }
          );
          // 三角形
          ctx.beginPath();
          ctx.moveTo(currentW / 2 - 7 * 2 * zoom, 370 * 2 * zoom);
          ctx.lineTo(currentW / 2 + 7 * 2 * zoom, 370 * 2 * zoom);
          ctx.lineTo(currentW / 2, 378 * 2 * zoom);
          ctx.closePath();
          ctx.fillStyle = "#FB9542";
          ctx.strokeStyle = "#FB9542";
          ctx.fill();
          ctx.stroke();
          // 二维码
          ctx.drawImage(
            imgQrcode,
            currentW / 2 - 50 * 2 * zoom,
            388 * 2 * zoom,
            100 * 2 * zoom,
            100 * 2 * zoom
          );
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#FB9542";
          ctx.font = 12 * 2 * zoom + "px PingFang-SC-Heavy";
          ctx.fillText("长按识别二维码进入活动", currentW / 2, 503 * 2 * zoom);
          // 生成base64海报地址
          let img = convertCanvasToImage(mycanvas);
          fn(img.src);
          // document.body.insertBefore(img, document.body.firstElementChild);
        });
      } catch (e) {
        console.log(e);
        Toast("生成海报失败，请重试！");
      }
    },
    ...mapMutations("common", ['registerStu', "setSelectedStu", "setActiveJoin"])
  },
  computed: {
    ...mapGetters(['getActiveJoin'])
  }
};
</script>

<style lang='less' scoped>
/deep/.van-dialog__header {
  padding-top: 20px;
  padding-bottom: 12px;
}
.post-img {
  width: 300px;
  margin: 10px auto 0;
  > img {
    width: 100%;
    display: block;
  }
  .photo-btn {
    margin-left: 50%;
    transform: translateX(-50%);
    color: #fff;
    text-align: center;
    font-size: 0.4rem;
    margin-top: 10px;
  }
}
.share-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    width: 300px;
    position: absolute;
    top: 0;
    right: 30px;
  }
}
.f15 {
  font-size: 15px;
}
.f13 {
  font-size: 13px;
}
.sms {
  border-radius: 4px;
  min-width: 76px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.send {
  color: #bbbbbb !important;
  border-color: #bbbbbb !important;
}
.btn {
  color: #fff;
  font-size: 18px;
  border: none;
  margin-top: 20px;
  background: -moz-linear-gradient(top, #e42a02 0%, #ff5c0a 100%);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0%, #e42a02),
    color-stop(100%, #ff5c0a)
  );
  background: -webkit-linear-gradient(top, #e42a02 0%, #ff5c0a 100%);
  background: -o-linear-gradient(top, #e42a02 0%, #ff5c0a 100%);
  background: -ms-linear-gradient(top, #e42a02 0%, #ff5c0a 100%);
  background: linear-gradient(to bottom, #e42a02 0%, #ff5c0a 100%);
}
.bg {
  background: url("../../../assets/img/weChat/invite/bg_1.png") repeat-y 100%
    100%;
  padding-bottom: 80px;
}
.topImg {
  width: 100%;
  display: block;
}

.boxWrap {
  position: relative;
  width: 342px;
  min-height: 100px;
  margin: 20px auto 0;
  // overflow: auto;
  .title {
    width: 342px;
    left: 50%;
    position: absolute;
    top: -29px;
    transform: translateX(-50%);
    z-index: 2;
    // height: 100px;
    // background-color: pink;
    .titleContent {
      display: flex;
      width: fit-content;
      color: #c05a00;
      font-size: 18px;
      font-weight: bold;
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      img {
        zoom: 0.5;
      }
      .titleTxt {
        padding-top: 2px;
        min-width: 100px;
        background: url("../../../assets/img/weChat/invite/biaoti_2.png")
          no-repeat center center/100% 100%;
        display: flex;
        justify-content: center;
        // line-height: 34px;
      }
    }
  }
  .box {
    width: 100%;
    min-height: 100%;
    position: relative;
    padding: 40px 22px 20px;
    box-sizing: border-box;
    &::before {
      content: "";
      width: 50px;
      background: url("https://cdntest.yizhiniao.com/new_admin1612517166364_未标题-1_04")
        center center/100%;
      position: absolute;
      left: 0;
      top: 50px;
      bottom: 50px;
    }
    &::after {
      content: "";
      width: 50px;
      background: url("https://cdntest.yizhiniao.com/new_admin1612517173144_未标题-1_06")
        center center/100%;
      right: 0;
      top: 0;
      position: absolute;
      top: 50px;
      bottom: 50px;
    }
    .forBg {
      position: absolute;
      top: 50px;
      left: 50px;
      bottom: 50px;
      right: 50px;
      background: url("https://cdntest.yizhiniao.com/new_admin1612517169873_未标题-1_05")
        center center/100%;
    }
    .rowCen {
      position: relative;
      z-index: 1;
      padding-top: 0;
      padding-bottom: 0;
      text-align: justify;
      span {
        color: #111;
        font-size: 12px;
      }
      .rowTxt {
        margin-bottom: 10px;
      }
      img {
        width: 100%;
        display: block;
        margin-bottom: 10px;
      }
    }
    .rowTop {
      top: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 50px;
      .corner_l {
        width: 50px;
        height: 50px;
        background: url("https://cdntest.yizhiniao.com/new_admin1612517156161_未标题-1_01")
          center center/100% 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .corner_r {
        width: 50px;
        height: 50px;
        background: url("https://cdntest.yizhiniao.com/new_admin1612517163065_未标题-1_03")
          center center/100% 100%;
        position: absolute;
        right: 0;
        top: 0;
      }
      .center {
        top: 0;
        left: 50%;
        background: url("https://cdntest.yizhiniao.com/new_admin1612517159000_未标题-1_02")
          center center/100% 100%;
        transform: translateX(-50%);
        width: calc(100% - 96px);
        height: 100%;
        position: absolute;
      }
    }
    .rowBot {
      bottom: 0;
      left: 0;
      position: absolute;
      width: 100%;
      height: 50px;
      .corner_l {
        width: 50px;
        height: 50px;
        background: url("https://cdntest.yizhiniao.com/new_admin1612517176186_未标题-1_07")
          center center/100% 100%;
        // background: url("../../../assets/img/weChat/invite/zuo_1.png") center
        //   center/100% 100%;

        position: absolute;
        top: 0;
        left: 0;
      }
      .corner_r {
        width: 50px;
        height: 50px;
        background: url("https://cdntest.yizhiniao.com/new_admin1612517182828_未标题-1_09")
          center center/100% 100%;
        // background: url("../../../assets/img/weChat/invite/you_3.png") center
        //   center/100% 100%;
        position: absolute;
        right: 0;
        top: 0;
      }
      .center {
        bottom: 0;
        left: 50%;
        background: url("https://cdntest.yizhiniao.com/new_admin1612517179644_未标题-1_08")
          center center/100% 100%;
        // background: url("../../../assets/img/weChat/invite/zhong_2.png") center
        //   center/100% 100%;
        transform: translateX(-50%);
        width: calc(100% - 96px);
        height: 100%;
        position: absolute;
      }
    }
  }
}
.mydata {
  border: 1px solid #de4728;
  border-radius: 4px;
  position: relative;
  width: 342px;
  margin: 40px auto 0;
  h2 {
    height: 26px;
    line-height: 26px;
    position: absolute;
    top: -13px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #ff7750;
    color: #ffe5e0;
    padding: 0 20px;
    margin: 0;
    &:before {
      content: "";
      display: block;
      position: absolute;
      top: 10px;
      left: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #e45538;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 10px;
      right: 0;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: #e45538;
    }
  }
  > div {
    width: 33.33%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px 0;
    color: #ffffff;
  }
}
.operateFixed {
  color: #595959;
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  font-size: 16px;
  z-index: 1993;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  > div:nth-of-type(1) {
    .van-button--normal {
      width: 100%;
    }
    var {
      width: 22px;
      height: 18px;
      display: block;
      background: url("../../../assets/img/weChat/invite/weixin.png") no-repeat;
      background-size: contain;
      margin-right: 4px;
    }
    flex: 1;
    color: #fff;
    background: -moz-linear-gradient(top, #ffd450 0%, #f9743b 100%);
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #ffd450),
      color-stop(100%, #f9743b)
    );
    background: -webkit-linear-gradient(top, #ffd450 0%, #f9743b 100%);
    background: -o-linear-gradient(top, #ffd450 0%, #f9743b 100%);
    background: -ms-linear-gradient(top, #ffd450 0%, #f9743b 100%);
    background: linear-gradient(to bottom, #ffd450 0%, #f9743b 100%);
  }

  > div:nth-of-type(2) {
    .van-button--normal {
      width: 100%;
      font-size: 16px;
    }
    var {
      width: 20px;
      height: 18px;
      display: block;
      background: url("../../../assets/img/weChat/invite/yaoqingka.png")
        no-repeat;
      background-size: contain;
      margin-right: 4px;
    }
    background: -moz-linear-gradient(top, #ffad84 0%, #ed2409 100%);
    background: -webkit-gradient(
      linear,
      left top,
      left bottom,
      color-stop(0%, #ffad84),
      color-stop(100%, #ed2409)
    );
    background: -webkit-linear-gradient(top, #ffad84 0%, #ed2409 100%);
    background: -o-linear-gradient(top, #ffad84 0%, #ed2409 100%);
    background: -ms-linear-gradient(top, #ffad84 0%, #ed2409 100%);
    background: linear-gradient(to bottom, #ffad84 0%, #ed2409 100%);
    flex: 1;
    color: #fff;
  }
}
</style>