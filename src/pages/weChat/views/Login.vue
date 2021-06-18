<template>
  <div>
    <van-form
      validate-first
      @failed="onFailed"
      class="form"
      ref="form"
      validate-trigger="onSubmit"
    >
      <van-field
        v-model="phone"
        name="phone"
        label="手机号"
        placeholder="手机号"
        :rules="[
          { required: true, message: '请输入手机号' },
          { pattern: phonePattern, message: '请输入正确电话号码' },
        ]"
      />

      <van-field
        v-model="sms"
        center
        label="验证码"
        maxlength="4"
        :rules="[{ required: true, message: '请输入验证码' }]"
        clearable
        placeholder="请输入收到的验证码"
      >
        <template #button>
          <van-button
            :class="{ send: sec > 0 }"
            :disabled="sec > 0"
            size="small"
            color="#ff5c0a"
            plain
            class="sms"
            native-type="button"
            @click="sendSms"
            >{{ btnTxt }}</van-button
          >
        </template>
      </van-field>

      <van-button
        class="btn"
        block
        type="info"
        native-type="submit"
        @click="login"
        >下一步</van-button
      >
    </van-form>

    <van-overlay :show="findStu" @click="findStu = false">
      <div class="login-wrapper" @click.stop>
        <div class="login-block">
          <div class="title">
            <van-icon name="cross" class="ico" @click="findStu = false" />
            <span>提示</span>
          </div>
          <div class="content">
            <p>
              手机号<span>{{ phone }}</span
              >未在机构报读，请使用在机构登记的学员手机号进行登录。
            </p>
            <div class="over-btn">
              <van-button
                class="bt"
                plain
                color="#f24407"
                @click="findStu = false"
                >返回修改</van-button
              >
              <van-button class="bt" plain color="#f24407" @click="toRegister"
                >新生报名</van-button
              >
            </div>
          </div>
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import throttle from "lodash/throttle";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { yznReq } from "@/utils/yznhttp";
let timer;
export default {
  data() {
    return {
      phonePattern: /^1\d{10}$/,
      sms: "",
      phone: "",

      btnTxt: "发送验证码",
      sec: "",
      groupId: "",
      fromOpenid: "",
      isJoinNow: "",

      findStu: false,
      findPhone: "",
    };
  },
  mounted() {
    this.groupId = this.$route.query.groupId;
    this.fromOpenid = this.$route.query.fromOpenid;
    this.isJoinNow = this.$route.query.isJoinNow;
    this.referralDataId = this.$route.query.referralDataId;
  },
  methods: {
    onFailed() {},
    sendSms() {
      if (!this.phone) {
        return;
      }
      let sec;
      sec = 60;
      setTimeout(() => {
        sec--;
        this.sec = sec;
        this.btnTxt = `已发送${sec}s`;
      }, 0);
      timer = setInterval(() => {
        if (sec <= 1) {
          this.sec = "";
          clearInterval(timer);
          this.btnTxt = "重新发送";
        } else {
          sec--;
          this.sec = sec;
          this.btnTxt = `已发送${sec}s`;
        }
      }, 1000);
      yznReq("get", "/api/oa/show/getAuthCode", {
        phone: this.phone,
      });
    },
    toRegister() {
      this.$router.push({
        path: "/register",
        query: {
          fromOpenid: this.fromOpenid,
          groupId: this.groupId,
          isJoinNow: this.isJoinNow,
          referralDataId: this.referralDataId,
        },
      });
    },
    login: throttle(function () {
      this.$refs.form
        .validate()
        .then(async (val) => {
          let res = await yznReq(
            "get",
            "/api/oa/show/signIn",
            {
              phone: this.phone,
              authCode: this.sms,
              activityId: this.getActivityId,
              openid: localStorage.getItem("yzn_openid"),
            },
            "206"
          );
          if (res.status == 200) {
            localStorage.setItem(`yzn_show_phone${this.getActivityId}`, this.phone);
            this.setStuList(res.context);
            if (res.context.length >= 1) {
              // console.log({
              //     showChoiceStu: 1,
              //     id: this.getActivityId,
              //     url_openid: this.fromOpenid,
              //     groupId: this.groupId,
              //     isJoinNow: this.isJoinNow,
              //     referralDataId: this.referralDataId,
              //   })
              // return
              this.$router.replace({
                path: "/index",
                query: {
                  showChoiceStu: 1,
                  id: this.getActivityId,
                  url_openid: this.fromOpenid,
                  groupId: this.groupId,
                  isJoinNow: this.isJoinNow,
                  referralDataId: this.referralDataId,
                },
              });
            } else {
              this.toRegister();
            }
          } else if (res.status == 206) {
            this.findStu = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }, 1000),
    ...mapMutations("common", ["setSelectedStu", "setStuList"]),
  },
  computed: {
    ...mapGetters(["getActivityId", "getActiveType"]),
  },
  watch: {
    btnTxt: function (val, newVal) {
      if (val < 1) {
        timer = null;
      }
    },
  },
};
</script>

<style scoped lang='less'>
.form {
  margin-top: 10px;
}
.sms {
  border-radius: 4px;
  min-width: 76px;
  height: 30px;
  line-height: 30px;
  text-align: center;
}
.btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, #ff5c0a 0%, #e42a02 100%);
  border: 1px solid #ff5c0a;
  position: absolute;
  bottom: 0;
}
.send {
  color: #bbbbbb !important;
  border-color: #bbbbbb !important;
}

.login-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.login-block {
  width: 310px;
  height: 211px;
  border-radius: 14px;
  background-color: #fff;
  position: relative;
  .title {
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    color: #292929;
    border-bottom: 1px solid #f5f5f5;
    .ico {
      position: absolute;
      top: 17px;
      font-size: 20px;
      left: 27px;
    }
  }
  .content {
    padding: 24px 24px 16px;
    p {
      line-height: 28px;
      font-size: 14px;
      margin: 0 2px 22px;
      color: #292929;
      span {
        color: #ff5c0a;
      }
    }
    .over-btn {
      display: flex;
      justify-content: space-between;
      .bt {
        width: 127px;
        height: 40px;
        border-radius: 4px;
        &:first-child {
          color: #595959;
        }
      }
    }
  }
}
</style>