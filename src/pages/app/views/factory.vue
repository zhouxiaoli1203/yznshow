<template>
  <div style="background-color: #f8f8f8; over-flow: auto; padding-bottom: 60px">
    <!-- <Leaflet
      v-if="activityType == 1"
      ref="form_maker_1"
      :showData="showData"
      @itemChange="change"
    /> -->
    <Rubbuy
      v-if="activityType == 2"
      ref="form_maker_2"
      :showData="showData"
      :cs="cs"
      @itemChange="change"
    />
    <!-- <Group
      v-if="activityType == 3"
      ref="form_maker_3"
      :showData="showData"
      :cs="cs"
      @itemChange="change"
    />
    <Bargain v-if="activityType == 4" />
    <Help v-if="activityType == 5" /> -->
    <!-- 提交预览 -->
    <div class="operateFixed">
      <div class="c_f_center">
        <van-button color="#13c2c2" @click="formSub()"> 保存 </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Leaflet from "../components/leaflet";
import Rubbuy from "../components/rubbuy";
import Group from "../components/group";
import Bargain from "../components/bargain";
import Help from "../components/help";
import { Toast } from "vant";
export default {
  name: "factory",
  components: { Bargain, Group, Help, Leaflet, Rubbuy },
  data() {
    return {
      activityType: "", //活动类型
      cs: "", //是否是自定义
      showData: {},
    };
  },
  methods: {
    change(val) {
      // console.log(val);
    },
    formSub() {
      let form = this.$refs["form_maker_" + this.activityType].$refs.form;
      form
        .validate()
        .then(() => {
          form.submit();
        })
        .catch((err) => {
          if(err[0].message){
            return Toast(err[0].message);
          }
        });
    },
  },
  mounted() {
    this.activityType = this.$route.query.tp;
    this.cs = this.$route.query.cs;
    if (localStorage.getItem("item")) {
      this.showData = JSON.parse(localStorage.getItem("item"));
      localStorage.removeItem('item')
    } else {
      this.showData = {
        limitItems: 0,
        placesLimit: 1, // 活动名额限制 0：不限制 1：限制
        places: "40", // 活动名额限制数
      };
      // if (this.activityType == 1) {
      //   this.showData.paySet = 1; //微传单 支付设置默认勾选 线下支付
      // }
      // if (this.activityType == 3) {
      //   //拼团
      //   this.showData.paySet = 3;
      //   this.showData.showContentRuleList = [];
      //   if (this.$route.query.cs == 2) {
      //     this.showData.showActivityCourseList = [];
      //   }
      // }
      if (this.activityType == 2) {
        this.showData.showActivityCourseList = [];
      }
    }
  },
};
</script>
<style lang="less" scoped>
.operateFixed {
  color: #fff;
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: row;
  z-index: 1993;
  background-color: #13c2c2;
  .c_f_center {
    width: 100%;
    .van-button--normal {
      font-size: 18px;
      width: 100%;
    }
  }
}
</style>
