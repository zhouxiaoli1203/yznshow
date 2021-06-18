<template>
  <div class="detail-bg">
    <div class="inputForm">
      <a-form layout="vertical" id="components-form-demo-validate-other">
        <!-- <a-form-item label="活动名称" required> -->
        <a-row>
          <p class="formLabel">活动名称<span>(25字)</span><b> *</b></p>
          <div
            :class="{
              'form-err-group': !getValidate('name') && !isValueNew('name'),
            }"
          >
            <a-input
              size="large"
              :maxLength="25"
              placeholder="请填写活动名称"
              @change="setFormValue($event.target.value, 'name')"
              :value="getName"
            />
            <div
              class="form-err"
              v-if="!getValidate('name') && !isValueNew('name')"
            >
              请填写课包名称(25字符以内)
            </div>
          </div>
        </a-row>
        <!-- </a-form-item> -->
        <div class="time">
          <a-row>
            <p class="formLabel">开始时间<b> *</b></p>
            <div
              :class="{
                'form-err-group': !getStartTime && !isValueNew('startTime'),
              }"
            >
              <a-date-picker
                :locale="locale"
                :disabled="isDisable()"
                size="large"
                placeholder="请选择开始时间"
                @change="setFormValue($event, 'startTime')"
                :value="getStartTime"
                :allowClear="false"
              />
              <div
                class="form-err"
                v-if="!getStartTime && !isValueNew('startTime')"
              >
                请选择开始时间
              </div>
            </div>
          </a-row>
          <span class="division">----</span>
          <a-row>
            <p class="formLabel">结束时间<b> *</b></p>
            <div
              :class="{
                'form-err-group': !getEndTime && !isValueNew('endTime'),
              }"
            >
              <a-date-picker
                :locale="locale"
                :disabled-date="disabledDate"
                :disabled="isDisable('endTime')"
                size="large"
                placeholder="请选择结束时间"
                @change="setFormValue($event, 'endTime')"
                :value="getEndTime"
                :allowClear="false"
              />
              <div
                class="form-err"
                v-if="!getEndTime && !isValueNew('endTime')"
              >
                请选择结束时间
              </div>
            </div>
          </a-row>
        </div>
      </a-form>
      <div class="line"></div>
      <a-row class="activeName noBt" :class="{ btline: getActiveType == 1 }">
        <a-col span="4" class="label">活动类型</a-col>
        <a-col span="18">
          <a-radio-group
            name="radioGroup"
            :disabled="isDisable()"
            :value="getActiveType"
            @change="setActiveTypeVal"
          >
            <a-radio :value="1">
              <span :class="{ 'ac-text': getActiveType == 1 }">微传单</span>
            </a-radio>
            <a-radio :value="2">
              <span :class="{ 'ac-text': getActiveType == 2 }">抢购</span>
            </a-radio>
            <a-radio :value="3">
              <span :class="{ 'ac-text': getActiveType == 3 }">拼团</span>
            </a-radio>
            <a-radio :value="4">
              <span :class="{ 'ac-text': getActiveType == 4 }">砍价</span>
            </a-radio>
            <a-radio :value="5">
              <span :class="{ 'ac-text': getActiveType == 5 }">助力</span>
            </a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row v-if="getActiveType != 1" style="margin-bottom: 0">
        <a-col span="4" class="label">活动内容</a-col>
        <a-col span="18">
          <a-radio-group
            :disabled="isDisable()"
            name="radioGroup"
            :value="getActiveContent"
            @change="setActiveContentVal"
          >
            <a-radio :value="1">
              <span :class="{ 'ac-text': getActiveContent == 1 }">自定义</span>
            </a-radio>
            <a-radio :value="2" v-if="$store.state.common.systemType == 2">
              <span :class="{ 'ac-text': getActiveContent == 2 }">课程</span>
            </a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
      <!-- 抢购 -->
      <flash ref="flash" v-if="getActiveType == 2 && getActiveContent == 2" />
      <flash-custom
        v-if="getActiveType == 2 && getActiveContent == 1"
        ref="flashCustomRef"
      />
      <!-- 微传单  类似于抢购自定义 -->
      <leaflet v-if="getActiveType == 1" ref="leafletRef" />
      <!-- 拼团 -->
      <group v-if="getActiveType == 3 && getActiveContent == 2" ref="group" />
      <group-custom
        v-if="getActiveType == 3 && getActiveContent == 1"
        ref="groupCustom"
      />
      <!-- 砍价 -->
      <bargain-custom
        v-if="getActiveType == 4 && getActiveContent == 1"
        ref="bargainCustom"
      />
      <bargin
        v-if="getActiveType == 4 && getActiveContent == 2"
        ref="bargain"
      />
      <!-- 助力 -->
      <help v-if="getActiveType == 5 && getActiveContent == 2" ref="help" />
      <help-custom
        v-if="getActiveType == 5 && getActiveContent == 1"
        ref="helpCustom"
      />

      <!-- <a-row
        style="margin-top: 20px"
        v-if="(getActiveType == 4 || getActiveType == 5) && getPaySet!=1"
      >
        <a-col span="3" class="payDead">付款截止<b>*</b></a-col>
        <a-col span="10">
          <div
            class="endTime"
            :class="{
              'form-err-group': !getPayDeadline && !isValueNew('payDeadline'),
            }"
          >
            <a-date-picker
              :locale="locale"
              :disabled="isDisable()"
              style="width: 100%"
              size="large"
              placeholder="请选择活动参与截至时间"
              @change="setFormValue($event, 'payDeadline')"
              :value="getPayDeadline"
            >
              <a-icon slot="suffixIcon" type="clock-circle" />
            </a-date-picker>
            <div
              class="form-err"
              v-if="!getPayDeadline && !isValueNew('payDeadline')"
            >
              请选择活动参与截至时间
            </div>
          </div>
        </a-col>
      </a-row> -->
    </div>

    <div class="botBtn">
      <a-button type="primary" size="large" class="next-btn" @click="goNext"
        >下一步</a-button
      >
    </div>
  </div>
</template>

<script>
// import flash from './components/flash'
import { validateStringLen } from "../../../utils/validate.js";
import { mapGetters, mapMutations, mapActions } from "vuex";
import moment from "moment";
// import Leaflet from './components/leaflet.vue'
import Leaflet from "./components/leaflet2.vue";
import Flash from "./components/flash.vue";
import FlashCustom from "./components/flashCustom.vue";
import Group from "./components/group.vue";
import GroupCustom from "./components/groupCustom.vue";
import BargainCustom from "./components/bargainCustom.vue";
import Bargin from "./components/bargain.vue";
import Help from "./components/help.vue";
import HelpCustom from "./components/helpCustom.vue";
import locale from "ant-design-vue/es/date-picker/locale/zh_CN";
import "moment/locale/zh-cn";
moment.locale("zh-cn");
export default {
  created() {
    this.isNew = {
      name: true,
      startTime: true,
      endTime: true,
      //payDeadline: true,
    };
  },
  data() {
    return {
      locale,
    };
  },
  computed: {
    getPaySet() {
      if (this.getActiveType == 4) {
        if (this.getActiveContent == 1) {
          return this.getBargainCustomItem("paySet");
        } else if (this.getActiveContent == 2) {
          return this.getBargainItem("paySet");
        }
      } else if (this.getActiveType == 5) {
        if (this.getActiveContent == 1) {
          return this.getHelpCustomItem("paySet");
        } else if (this.getActiveContent == 2) {
          return this.getHelpItem("paySet");
        }
      }
    },
    ...mapGetters([
      "getActiveType",
      "getActiveContent",
      "getPackages",
      "getPackageItem",
      "getName",
      "getStartTime",
      "getEndTime",
      "getFirstEndTime",
      // "getPayDeadline",
      "getMode",
      "getSystemType",
      "getActivityStatus",

      "getBargainCustomItem",
      "getBargainItem",
      "getHelpCustomItem",
      "getHelpItem",
    ]),
  },
  methods: {
    disabledDate(current) {
      return (
        current &&
        current < moment(this.getStartTime).subtract(1, "days").endOf("day")
      );
    },

    goNext() {
      this.isNew = {
        name: false,
        startTime: false,
        endTime: false,
      };

      this.$forceUpdate();

      let isChecked;
      if (this.getActiveType == 1) {
        isChecked = this.$refs.leafletRef.validate();
      } else if (this.getActiveType == 2 && this.getActiveContent == 1) {
        isChecked = this.$refs.flashCustomRef.validate();
      } else if (this.getActiveType == 2 && this.getActiveContent == 2) {
        isChecked = this.$refs.flash.validate();
      } else if (this.getActiveType == 3) {
        if (this.getActiveContent == 1) {
          isChecked = this.$refs.groupCustom.validate();
        } else if (this.getActiveContent == 2) {
          isChecked = this.$refs.group.validate();
        }
      } else if (this.getActiveType == 4) {
        if (this.getActiveContent == 1) {
          isChecked = this.$refs.bargainCustom.validate();
        } else if (this.getActiveContent == 2) {
          isChecked = this.$refs.bargain.validate();
        }
      } else if (this.getActiveType == 5) {
        if (this.getActiveContent == 1) {
          isChecked = this.$refs.helpCustom.validate();
        } else if (this.getActiveContent == 2) {
          isChecked = this.$refs.help.validate();
        }
      }
      // if ((this.getActiveType == 4 || this.getActiveType == 5) && isChecked) {
      //   if (this.getPayDeadline) {
      //     isChecked = true;
      //   } else {
      //     isChecked = false;
      //   }
      // }

      if (!this.getName || !this.getStartTime || !this.getEndTime) {
        isChecked = false;
      }

      if (isChecked) {
        this.$parent.goNext(1);
      } else {
        this.$parent.movePreview(1);
      }
    },
    isValueNew(name) {
      return this.isNew[name];
    },
    setFormValue(val, name) {
      if (name == "name") {
        this.setProductName(val);
        this.setName(val);
        this.setShareTitle(this.$store.state.common.name);
      } else if (name == "startTime") {
        this.setStartTime(val.startOf("day"));
        let b = moment(val).add(29, "d").endOf("day");
        //let p = moment(val).add(36, "d").endOf("day");
        this.setEndTime(b);
        //this.setPayDeadline(p);
      } else if (name == "endTime") {
        if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
          let edT = this.getFirstEndTime;
          if (edT > val) {
            this.$message.error(
              `活动${this.getActivityStatus == 2?'进行中':'已结束'}，时间不能小于${edT.format("YYYY-MM-DD")}`
            );
            return;
          }
        }
        this.setEndTime(val.endOf("day"));
      }
      let obj = this.isNew;
      obj[name] = false;
      this.isNew = obj;
    },
    getValidate(name) {
      if (name == "name") {
        return validateStringLen(this.getName, 25);
      }
    },
    isDisable(name) {
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 1) {
        return false;
      } else if (this.getActivityStatus == 2) {
        if (name == "endTime") {
          return false;
        }
        return true;
        // }
      } else if (this.getActivityStatus == 3) {
        if (this.getActiveType == 1) {
          return false;
        } else if (this.getActiveType == 3) {
          return true;
        } else {
          if (name == "endTime") {
            return false;
          }
          return true;
        }
      } else if (this.getActivityStatus == 0) {
        return false;
      }
    },
    setActiveTypeVal(e) {
      // this.type = e.target.value;
      this.setActiveType(e.target.value);
    },
    setActiveContentVal(e) {
      // this.contentType = e.target.value;
      this.setActiveContent(e.target.value);
    },
    ...mapMutations("common", [
      "setActiveType",
      "setActiveContent",
      "setStartTime",
      "setEndTime",
      "setName",
      // "setPayDeadline",
      "setShareTitle",
    ]),
    // ...mapMutations("flash", ["setPackages"]),
    ...mapActions("leaflet", ["setProductName"]),
    ...mapActions("common", ["getPreviewTemp"]),
    // ...mapActions('flash',[
    //   "addPackage",
    //   "addCourseByIndex",
    //   "deletePackageByIndex",
    //   "deleteCourseByIndex",
    //   "setPackagesItemByName",
    //   "setPackageCourseItemByName",
    // ]),
  },
  components: {
    Flash,
    FlashCustom,
    Group,
    GroupCustom,
    BargainCustom,
    Bargin,
    Help,
    HelpCustom,
    Leaflet,
  },
};
</script>

<style lang="less" scoped>
.ant-form-item {
  margin-bottom: 8px;
}
.endTime .form-err {
  top: -22px;
}
.line {
  margin-top: 6px;
  height: 0;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
}
.detail-bg {
  // max-height: calc(100vh - 200px);
  // overflow: scroll;
}
.inputForm {
  //width: 680px;
  margin: 16px 100px 80px;
  .time {
    display: flex;
    justify-content: space-between;
    .division {
      padding-top: 33px;
      color: #dbdbdb;
    }
  }
  .times {
    width: 45%;
  }
  .label {
    padding-bottom: 20px;
  }
  b {
    font-weight: normal;
    color: #f84f43;
  }
  p {
    margin-bottom: 4px;
    span {
      font-size: 14px;
      color: #595959;
    }
  }
  .ant-row {
    margin-bottom: 16px;
  }
}
.activeName {
  &.noBt {
    margin-bottom: 0;
  }
  &.btline {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 20px;
  }
  margin-top: 20px;
}
.inputForm .ant-calendar-picker {
  width: 283px;
}

.botBtn {
  padding-top: 10px;
  border-top: 1px solid #f2f2f2;
  text-align: center;
  padding-bottom: 10px;
  position: fixed;
  right: 0;
  bottom: 0;
  width: 823px;
  background-color: #fff;
  z-index: 3;
}
.payDead {
  line-height: 40px;
  margin-right: 6px;
  b {
    color: #f84f43;
  }
}

.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}
</style>