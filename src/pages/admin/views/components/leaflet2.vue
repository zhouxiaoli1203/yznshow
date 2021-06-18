<template>
  <div>
    <a-row>
      <a-col span="6">
        <p class="formLabel noBot">
          新老生参与限制
          <a-tooltip>
            <template slot="title"
              >新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template
            >
            <a-icon type="question-circle" class="limitIcon" theme="filled" />
          </a-tooltip>
        </p>
      </a-col>
      <a-col span="12">
        <a-switch
          class="stuLimit"
          :disabled="isDisable()"
          :checked="Boolean(getLeafletPackageItem('limitItems', 0))"
          @change="setValue(0, 'limitItems', Number($event))"
        />
      </a-col>
    </a-row>
    <a-row v-if="getLeafletPackageItem('limitItems', 0)">
      <a-col class="hei">
        <a-radio-group
          :disabled="isDisable()"
          name="radioGroup"
          @change="setValue(0, 'limitItems', $event.target.value)"
          :value="getLeafletPackageItem('limitItems', 0)"
        >
          <a-radio :value="1">仅允许新生参与活动</a-radio>
          <a-radio :value="2">仅允许老生参与活动</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="lineTop">
      <a-col span="4"><p class="rowText">活动名额</p></a-col>
      <a-col span="20">
        <a-radio-group
          class="rowTop"
          size="large"
          :disabled="isDisable('placesLimit', 0)"
          @change="setValue(0, 'placesLimit', $event.target.value)"
          :value="getLeafletPackageItem('placesLimit', 0)"
        >
          <a-radio :value="0">
            <span
              :class="{
                'ac-text': getLeafletPackageItem('placesLimit', 0) === 0,
              }"
              >不限</span
            >
          </a-radio>
          <a-radio :value="1">
            <span
              :class="{
                'ac-text': getLeafletPackageItem('placesLimit', 0) == 1,
              }"
              >仅限</span
            >
            <!-- @blur="checkNumber($event, 0)" -->
            <a-input
              type="number"
              :disabled="isDisable('places', 0)"
              style="width: 60px; height: 26px"
              @change="setValue(0, 'places', $event.target.value)"
              :value="getLeafletPackageItem('places', 0)"
            />
            <span
              :class="{
                'ac-text': getLeafletPackageItem('placesLimit', 0) == 1,
              }"
              >名</span
            >
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="lineTop">
      <a-col span="4"><p class="rowText">线上支付</p></a-col>
      <a-col>
        <a-switch
          :disabled="isDisable()"
          :checked="Boolean(getLeafletPackageItem('paySwitch', 0))"
          @change="setValue(0, 'paySwitch', Number($event))"
        />
      </a-col>
    </a-row>
    <a-row v-if="getLeafletPackageItem('paySwitch', 0)">
      <a-col span="4"><p class="rowText">支付设置</p></a-col>
      <a-col span="20">
        <a-radio-group
          :disabled="isDisable()"
          class="rowTop"
          size="large"
          @change="setValue(0, 'paySet', $event.target.value)"
          :value="getLeafletPackageItem('paySet', 0)"
        >
          <a-radio :value="1">
            <span
              :class="{
                'ac-text': getLeafletPackageItem('paySet', 0) == 1,
              }"
              >全额</span
            >
          </a-radio>
          <a-radio :value="3">
            <span
              :class="{
                'ac-text': getLeafletPackageItem('paySet', 0) == 3,
              }"
              >预付款</span
            >
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row v-if="getLeafletPackageItem('paySwitch', 0)">
      <a-col span="4"><p class="rowText">支付金额</p></a-col>
      <a-col span="20">
        <a-input
          :disabled="isDisable()"
          type="number"
          style="width: 60px; height: 26px"
          @change="setValue(0, 'prepaidAmount', $event.target.value)"
          :value="getLeafletPackageItem('prepaidAmount', 0)"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import { mapActions, mapGetters, mapMutations } from "vuex";
import {
  validateInteger,
  validateRequire,
  validateFloat,
  validateStringLen,
} from "../../../../utils/validate.js";
export default {
  data() {
    return {
      mode: true,
      // isNew: [],
      oldPlaces: "",
    };
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getLeaflet);
      this.oldPlaces = this.getLeafletPackageItem("oldPlaces", 0);
    }, 800);
  },
  methods: {
    isDisable(name, index) {
      if (name == "places") {
        if (this.getLeafletPackageItem("placesLimit", index) == 0) {
          return true;
        }
      }
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        if (name == "placesLimit") {
          return false;
        } else if (name == "places") {
          if (this.getLeafletPackageItem("placesLimit", index) == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
    },
    // checkNumber(e, index) {
    //   let n = e.target.value;
    //   if (n && !/(^[0-9]\d*$)/.test(n)) {
    //     this.$message.error("活动名额需是正整数");
    //     this.setValue(index, "places", this.oldPlaces);
    //     return;
    //   }
    //   if (this.getActivityStatus == 2) {
    //     if (n >= this.oldPlaces) {
    //       this.setValue(index, "places", n);
    //     } else {
    //       this.$message.error("开始后名额不能减少");
    //       this.setValue(index, "places", this.oldPlaces);
    //     }
    //   }
    // },
    setValue(index, name, value) {
      // 两位小数
      if (name == "prepaidAmount") {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      if (name == "places") {
        value = String(value).replace(/\D/g, "");
      }
      if (name == "placesLimit" && value == 0) {
        this.setPackagesItemByName({
          index,
          name: 'places',
          value: "",
        });
      }
      if (
        name == "placesLimit" &&
        this.getActivityStatus == 2 &&
        this.getMode == 2
      ) {
        let oldLimit = this.packages[index][name];
        if (oldLimit == 0 && value == 1) {
          this.$message.error("开始后名额不能由不限改限制");
          return;
        }
      }
      this.setPackagesItemByName({
        index,
        name,
        value,
      });
    },
    validate() {
      let packages = this.getLeaflet;
      for (let i = 0; i < packages.length; i++) {
        let obj = packages[i];
        if (obj.placesLimit == 1) {
          if (obj.places == undefined || obj.places == "") {
            this.$message.error("活动名额不能为空");
            return false;
          } else {
            if (obj.places && !/(^[0-9]\d*$)/.test(obj.places)) {
              this.$message.error("活动名额需是正整数");
              return false;
            }
          }
          if (this.getActivityStatus == 2 && this.getMode == 2) {
            if (obj.places * 1 < this.oldPlaces * 1) {
              this.$message.error("开始后名额不能减少");
              this.setValue(0, "places", this.oldPlaces);
              return false;
            }
          }
        }

        if (obj.paySwitch) {
          if (obj.prepaidAmount == undefined || obj.prepaidAmount == "") {
            this.$message.error("支付金额不能为空");
            return false;
          }
        }
      }
      return true;
    },
    ...mapActions("leaflet", ["setPackagesItemByName"]),
  },
  computed: {
    ...mapGetters([
      "getMode",
      "getLeaflet",
      "getLeafletPackageItem",
      "getLeafletItem",

      "getActivityStatus",
      "getSignUpLimit",
      "getLimitNum",
    ]),
  },
};
</script>

<style scoped>
.stuLimit {
  margin-bottom: 16px;
}
.formLabel.noBot {
  margin-bottom: 0;
}
.limitIcon {
  font-size: 14px;
  color: #d8d8d8;
}
.hei {
  height: 40px;
}
.lineTop {
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
}
</style>