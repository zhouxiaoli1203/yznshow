<template>
  <div>
    <van-form validate-first @submit="submit">
      <van-field
        v-if="checkIsShow('name')"
        v-model="name"
        name="username"
        label="学员姓名"
        placeholder="学员姓名"
        maxlength="12"
        :rules="[{ required: true, message: '请输入学员姓名' }]"
      />

      <van-field label="联系电话" :value="phone" readonly />

      <van-field
        v-if="checkIsShow('sex')"
        name="sex"
        label="性别"
        placeholder="性别"
        :rules="[{ required: true, message: '请选择性别' }]"
      >
        <template #input>
          <van-radio-group
            v-model="sex"
            direction="horizontal"
            checked-color="#ff5c0a"
          >
            <van-radio :name="1">男</van-radio>
            <van-radio :name="0">女</van-radio>
          </van-radio-group>
        </template>
      </van-field>

      <van-field
        v-if="checkIsShow('birthday')"
        readonly
        clickable
        name="birthday"
        :value="birthday"
        label="生日"
        placeholder="生日"
        @click="showCalendar = true"
        :rules="[{ required: true, message: '请选择日期' }]"
      />

      <van-field
        v-if="checkIsShow('age')"
        v-model="age"
        name="age"
        label="年龄"
        placeholder="年龄"
        :rules="[{ required: true, message: '请输入学员年龄' }]"
      />

      <van-field
        v-if="checkIsShow('grade')"
        readonly
        clickable
        name="grade"
        :value="grade"
        label="年级"
        placeholder="年级"
        @click="showPicker = true"
        :rules="[{ required: true, message: '请选择年级' }]"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @confirm="onConfirmGrade"
          @cancel="showPicker = false"
        />
      </van-popup>

      <van-field
        v-if="checkIsShow('schoolname')"
        v-model="schoolname"
        name="schoolname"
        label="在读学校"
        placeholder="在读学校"
        maxlength="24"
        :rules="[{ required: true, message: '请输入在读学校' }]"
      />

      <van-popup v-model="showCalendar" position="bottom">
        <van-datetime-picker
          @confirm="onConfirm"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
        />
      </van-popup>

      <van-button class="btn" block type="info" native-type="submit"
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
              >绑定的学员已在机构报读，请登录后参与活动。
            </p>
            <div class="over-btn">
              <van-button
                class="bt"
                plain
                color="#f24407"
                @click="findStu = false"
                >修改信息</van-button
              >
              <van-button class="bt" plain color="#f24407" @click="toLogin"
                >学员登录</van-button
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
import { yznReq } from "@/utils/yznhttp";
import { gradeList } from "@/utils/constant.js";
import { Notify, Toast } from "vant";
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      phonePattern: /^1\d{10}$/,
      infoList: [],
      age: "",
      name: "",
      phone: "",
      birthday: "",
      grade: "",
      gradeId: "",
      sex: "",
      schoolname: "",

      showPicker: false,
      showCalendar: false,
      columns: [
        {
          text: "幼儿园",
          children: [
            {
              text: "托班",
            },
            {
              text: "小班",
            },
            {
              text: "中班",
            },
            {
              text: "大班",
            },
          ],
        },
        {
          text: "小学",
          children: [
            {
              text: "一年级",
            },
            {
              text: "二年级",
            },
            {
              text: "三年级",
            },
            {
              text: "四年级",
            },
            {
              text: "五年级",
            },
            {
              text: "六年级",
            },
          ],
        },
        {
          text: "初中",
          children: [
            {
              text: "初一",
            },
            {
              text: "初二",
            },
            {
              text: "初三",
            },
          ],
        },
        {
          text: "高中",
          children: [
            {
              text: "高一",
            },
            {
              text: "高二",
            },
            {
              text: "高三",
            },
          ],
        },
      ],

      findStu: false,
      findPhone: "15544445441",
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(),

      groupId: "",
      fromOpenid: "",
      isJoinNow: "",
      referralDataId: "",
    };
  },
  mounted() {
    let info = this.getInfo;
    if (info) {
      info = info.split(",");
      this.infoList = info;
    }
    this.phone = localStorage.getItem(`yzn_show_phone${this.getActivityId}`);
    this.groupId = this.$route.query.groupId;
    this.fromOpenid = this.$route.query.fromOpenid;
    this.isJoinNow = this.$route.query.isJoinNow;
    this.referralDataId = this.$route.query.referralDataId;
  },
  methods: {
    checkIsShow(name) {
      return this.infoList.includes(name);
    },
    toLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    submit: throttle(function (v) {
      let params = {
        name: v.username || undefined,
        birthday: v.birthday || undefined,
        sex: v.sex !== "" ? v.sex : undefined,
        grade: this.gradeId || undefined,
        age: v.age || undefined,
        schoolName: v.schoolname || undefined,
        potentialCustomerParentPhone: this.phone,
      };
      this.registerStu(params);
      this.setSelectedStu(params);
      if (this.getActiveType == 2 && this.getPackageLen > 1) {
        this.$router.replace({
          path: "/index",
          query: {
            fromRegis: 1,
            id: this.getActivityId,
            showChoiceLesson: 1,
            url_openid: this.fromOpenid,
            isJoinNow: this.isJoinNow,
            referralDataId: this.referralDataId,
          },
        });
      } else if (
        (this.getActiveType == 1 && !this.getSelectedCourse[0].paySwitch) ||
        this.getActiveType == 4 ||
        this.getActiveType == 5
      ) {
        setTimeout(() => {
          this.comfirmPay(params);
        }, 300);
      } else {
        this.$router.replace({
          path: "/comfirm",
          query: {
            groupId: this.groupId || undefined,
            fromOpenid: this.fromOpenid,
            referralDataId: this.referralDataId,
          },
        });
      }

      // this.yznReq("post", "/api/oa/show/signUp", params, "206").then((res) => {
      //   if (res.status == 200) {
      //     this.setSelectedStu(res.context);
      //     let arr = [res.context];
      //     this.setStuList(arr);
      //     if (
      //         (this.getActiveType == 1 && this.getSelectedCourse[0].paySwitch) ||
      //         (this.getActiveType == 2 && this.getSelectedCourse.length == 1)
      //     ) {
      //       this.$router.replace({
      //         path: '/comfirm',
      //         query: {
      //           fromOpenid: this.fromOpenid,
      //           referralDataId: this.referralDataId,
      //         }
      //       })
      //     } else if (this.getActiveType == 1 && !this.getSelectedCourse[0].paySwitch) {
      //       this.comfirmPay()
      //     } else if (this.getActiveType == 2 && !this.getSelectedCourse.length) {
      //       this.$router.replace({
      //         path: '/index',
      //         query: {
      //           id: this.getActivityId,
      //           showChoiceLesson: 1,
      //           fromRegis: 1,
      //           url_openid: this.fromOpenid,
      //           referralDataId: this.referralDataId,
      //         }
      //       })
      //     }
      //   } else if (res.status == 206) {
      //     this.findStu = true;
      //   }
      // });
    }, 1000),
    onConfirmGrade(v) {
      this.grade = v.join(",");
      this.showPicker = false;
      let item = gradeList.find((i) => {
        return i.name == v[1];
      });
      this.gradeId = item.id;
    },
    onConfirm(v) {
      this.birthday = moment(v).format("YYYY-MM-DD");
      this.showCalendar = false;
    },

    // 如果是不付钱的微传单,砍价，助力  注册完直接报名
    comfirmPay: throttle(async function (customer) {
      let id = this.getSelectedCourse[0].contentId;
      let conIds = [id];
      let params = {
        activityId: this.getActivityId,
        openid: localStorage.getItem("yzn_openid"), // 微信ID
        referralDataId:
          this.referralDataId && this.referralDataId != "undefined"
            ? this.referralDataId
            : undefined,
        fromOpenid: this.fromOpenid ? this.fromOpenid : undefined,
        potentialCustomer: customer,
        contentIds: conIds,
      };
      if (this.getSelectedStu.old) {
        params.potentialCustomer[
          "potentialCustomerId"
        ] = this.getSelectedStu.potentialCustomerId;
      }
      let res = await yznReq("post", "api/oa/show/joinActivity", params);
      if (res && res.status == 200) {
        if (this.getActiveType == 1) {
          this.setIndexPop({
            show: true,
            btn: "我知道了",
            type: "1",
            title: "恭喜您！报名成功",
            desc: "您已报名，我们将会尽快与您联系完善入学事宜",
          });
        } else if (this.getActiveType == 4) {
          Toast("报名成功，先自砍一刀试试手气吧");
        } else if (this.getActiveType == 5) {
          Toast("报名成功，先为自己助力试试手气吧！");
        }
        this.$router.push({
          path: "/index",
          query: {
            id: this.getActivityId,
            referralDataId: this.$route.query.referralDataId,
          },
        });
      }
      // this.$router.replace({
      //   path: "/comfirm",
      //   query: {
      //     groupId: this.groupId || undefined,
      //     fromOpenid: this.fromOpenid,
      //     referralDataId: this.referralDataId,
      //   },
      // });
    }, 1000),
    ...mapMutations("common", ["setSelectedStu", "setStuList", "registerStu", "setIndexPop"]),
  },
  computed: {
    ...mapGetters([
      "getSelectedStu",
      "getInfo",
      "getActivityId",
      "getActiveType",
      "getSelectedCourse",
      "getStuList",
      "getPackageLen",
    ]),
  },
};
</script>

<style scoped lang='less'>
.btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(180deg, #ff5c0a 0%, #e42a02 100%);
  border: 1px solid #ff5c0a;
  position: absolute;
  bottom: 0;
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
      font-size: 15px;
      margin: 0 10px 22px;
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