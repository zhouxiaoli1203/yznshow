<template>
  <div>
    <div class="block">
      <div class="title">
        <span>自定义</span>
      </div>
      <div class="content">
        <a-row>
          <p class="label">商品名称<span>（20字）</span> <b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getPackageValidate('productName') &&
                !isValueNew('productName'),
            }"
          >
            <a-input
              :maxLenght="20"
              :disabled="isDisable()"
              size="large"
              placeholder="请填写商品名称"
              @change="setValue('productName', $event.target.value)"
              :value="getHelpCustomItem('productName')"
            />
            <div
              class="form-err"
              v-if="
                !getPackageValidate('productName') && !isValueNew('productName')
              "
            >
              商品名称不能为空
            </div>
          </div>
        </a-row>
        <a-row class="text">
          <p class="label">商品描述 <b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getPackageValidate('productDesc') &&
                !isValueNew('productDesc'),
            }"
          >
            <a-textarea
              :disabled="isDisable()"
              size="large"
              placeholder="请填写商品名称"
              :rows="4"
              :maxLength="200"
              @change="setValue('productDesc', $event.target.value)"
              :value="getHelpCustomItem('productDesc')"
            />
            <div
              class="form-err"
              v-if="
                !getPackageValidate('productDesc') && !isValueNew('productDesc')
              "
            >
              请填写商品描述
            </div>
          </div>
          <span
            ><s>{{ getHelpCustomItem("productDesc").length }}</s
            >/200</span
          >
        </a-row>
        <a-row>
          <a-col>
            <p class="label">原价(元) <b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('originalPrice') &&
                  !isValueNew('originalPrice'),
              }"
            >
              <a-input
                :disabled="isDisable()"
                :maxLength="7"
                size="large"
                placeholder="请填写商品原价"
                @change="setValue('originalPrice', $event.target.value)"
                :value="getHelpCustomItem('originalPrice')"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('originalPrice') &&
                  !isValueNew('originalPrice')
                "
              >
                商品原价不能为空
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <p class="label">活动价(元) <b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('floorPrice') &&
                  !isValueNew('floorPrice'),
              }"
            >
              <a-input
                :disabled="isDisable()"
                size="large"
                :maxLength="7"
                placeholder="请填写活动价"
                @change="setValue('floorPrice', $event.target.value)"
                :value="getHelpCustomItem('floorPrice')"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('floorPrice') && !isValueNew('floorPrice')
                "
              >
                商品活动价不能为空
              </div>
            </div>
            <div class="col-tips">
              (注：助力活动，用户助力成功后，才能以活动价下单购买)
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <p class="label">需获得的助力包数量<b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('packagesNumber') &&
                  !isValueNew('packagesNumber'),
              }"
            >
              <a-input
                :maxLength="4"
                :disabled="isDisable()"
                size="large"
                placeholder="请填写助力包数量"
                @change="setValue('packagesNumber', $event.target.value)"
                :value="getHelpCustomItem('packagesNumber')"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('packagesNumber') &&
                  !isValueNew('packagesNumber')
                "
              >
                请填写助力包数量
              </div>
              <div class="col-tips">(注：达到助力包数量后，表示助力成功)</div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <p class="labelNum">
              每人最多助力包数<b>*</b><span>(每人次最多8个助力包)</span>
            </p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('maxNumber') && !isValueNew('maxNumber'),
              }"
            >
              <a-select
                :disabled="isDisable()"
                size="large"
                placeholder="单次最大助力包数"
                @change="setValue('maxNumber', $event)"
                :value="getHelpCustomItem('maxNumber')"
              >
                <a-select-option :value="1">1</a-select-option>
                <a-select-option :value="2">2</a-select-option>
                <a-select-option :value="3">3</a-select-option>
                <a-select-option :value="4">4</a-select-option>
                <a-select-option :value="5">5</a-select-option>
                <a-select-option :value="6">6</a-select-option>
                <a-select-option :value="7">7</a-select-option>
                <a-select-option :value="8">8</a-select-option>
              </a-select>
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('maxNumber') && !isValueNew('maxNumber')
                "
              >
                请选择单次最大助力
              </div>
            </div>
            <div class="col-tips">(注：最多可设置8个助力包)</div>
            <div class="col-tips t2">
              (建议设置2～8 ,
              例如：设置6，则好友助力时，会在1-6范围内，随机获得助力包)
            </div>
          </a-col>
        </a-row>
      </div>
    </div>

    <a-row class="mt20">
      <a-col span="6">
        新老生参与限制
        <a-tooltip>
          <template slot="title">新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template>
          <a-icon type="question-circle" class="limitIcon" theme='filled'/>
        </a-tooltip>
      </a-col>
      <a-col span="12">
        <a-switch
          class="stuLimit"
          :disabled="isDisable()"
          :checked="Boolean(getHelpCustomItem('limitItems'))"
          @change="setValue('limitItems', Number($event))"
        />
      </a-col>
    </a-row>
    <a-row v-if="getHelpCustomItem('limitItems')" class="mt20">
      <a-col class="hei">
        <a-radio-group
          :disabled="isDisable()"
          name="radioGroup"
          @change="setValue('limitItems', $event.target.value)"
          :value="getHelpCustomItem('limitItems')"
        >
          <a-radio :value="1">仅允许新生参与活动</a-radio>
          <a-radio :value="2">仅允许老生参与活动</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <a-row class="mt15 pt15 lineTop">
      <a-col span="4" class="mt2">活动名额</a-col>
      <a-col span="20">
        <a-radio-group
          class="rowTop"
          size="large"
          :disabled="isDisable('placesLimit')"
          @change="setValue('placesLimit', $event.target.value)"
          :value="getHelpCustomItem('placesLimit')"
        >
          <a-radio :value="0">
            <span
              :class="{
                'ac-text': getHelpCustomItem('placesLimit') === 0,
              }"
              >不限</span
            >
          </a-radio>
          <a-radio :value="1">
            <span
              :class="{
                'ac-text': getHelpCustomItem('placesLimit') == 1,
              }"
              >仅限</span
            >
            <!-- @blur="checkNumber($event, 0)" -->
            <a-input
              type="number"
              :disabled="isDisable('places')"
              style="width: 60px; height: 26px"
              @change="setValue('places', $event.target.value)"
              :value="getHelpCustomItem('places')"
            />
            <span
              :class="{
                'ac-text': getHelpCustomItem('placesLimit') == 1,
              }"
              >名</span
            >
          </a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  validateInteger,
  validateRequire,
  validateFloat,
  validateStringLen,
} from "@/utils/validate.js";
import cloneDeep from "lodash/cloneDeep";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  created() {
    let copy = JSON.parse(JSON.stringify(this.getHelpCustom));
    for (let i in copy) {
      copy[i] = true;
    }
    this.isNew = copy;
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getHelpCustom);
    }, 800);
  },
  data() {
    return {
      oldPlaces: "",
      packages: {},
      //oldPre: "",
    };
  },
  methods: {
    isDisable(name) {
      if (name == "places") {
        if (this.getHelpCustomItem("placesLimit") == 0) {
          return true;
        }
      }
      // if (name == "prepaidAmount") {
      //   if (this.getHelpCustomItem("paySet") != 3) {
      //     return true;
      //   }
      // }
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        if (name == "placesLimit") {
          return false;
        } else if (name == "places") {
          if (this.getHelpCustomItem("placesLimit") == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
    },
    getPackageValidate(name) {
      let c = this.getHelpCustomItem(name);
      if (name == "floorPrice" || name == "originalPrice") {
        return validateRequire(c);
      } else if (name == "productName") {
        return validateStringLen(c, 20);
      } else if (name == "packagesNumber") {
        return validateInteger(c);
      } else if (name == "productDesc") {
        return validateStringLen(c, 200);
      } else if (name == "maxNumber") {
        return validateRequire(c);
      }
      // if (!c) {
      //   this.isChecked = false;
      //   return false;
      // } else {
      //   this.isChecked = true;
      //   return true;
      // }
    },
    isValueNew(name) {
      if (this.isNew[name] !== false) {
        return true;
      }
    },
    setValue(name, value) {
      // 两位小数
      if (
        name == "originalPrice" ||
        name == "floorPrice"
      ) {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      // 整数
      if (name == "places" || name == "packagesNumber") {
        value = value.replace(/\D/g, "");
      }
      if (name == "places") {
        this.oldPlaces = this.getHelpCustomItem("places");
      }
      if (
        name == "placesLimit" &&
        this.getActivityStatus == 2 &&
        this.getMode == 2
      ) {
        let oldLimit = this.packages[name];
        if (oldLimit == 0 && value == 1) {
          this.$message.error("开始后名额不能由不限改限制");
          return;
        }
      }
      this.setHelpCustom({
        name,
        value,
      });
      this.$forceUpdate();
      let isnew = this.isNew;
      isnew[name] = false;
      this.isNew = isnew;
    },
    // checkNumber(e) {
    //   let n = e.target.value;
    //   if (n && !/(^[0-9]\d*$)/.test(n)) {
    //     this.$message.error("活动名额需是正整数");
    //     this.setValue("places", n);
    //     return;
    //   }
    //   if (this.getActivityStatus == 2) {
    //     if (n >= this.oldPlaces) {
    //       this.setValue("places", n);
    //     } else {
    //       this.$message.error("开始后名额不能减少");
    //       this.setValue("places", this.oldPlaces);
    //     }
    //   }
    // },
    // checkPre(val) {
    //   if (val * 1 > this.getHelpCustomItem("floorPrice") * 1) {
    //     this.$message.error("预付价必须小于活动价");
    //     this.setHelpCustom({
    //       name: "prepaidAmount",
    //       value: this.getHelpCustomItem("floorPrice"),
    //     });
    //   }
    // },
    validate() {
      let arr = {};
      Object.keys(this.isNew).forEach((i) => {
        arr[i] = false;
      });
      this.isNew = arr;
      this.$forceUpdate();
      let obj = this.getHelpCustom;
      if (!validateStringLen(obj.productName, 20)) {
        return false;
      }
      if (!validateStringLen(obj.productDesc, 200)) {
        return false;
      }
      if (!validateRequire(obj.originalPrice)) {
        return false;
      }
      if (!validateRequire(obj.floorPrice)) {
        return false;
      }
      if (Number(obj.floorPrice) >= Number(obj.originalPrice)) {
        this.$message.error("活动价必须小于原价");
        return false;
      }
      if (!validateInteger(obj.packagesNumber)) {
        return false;
      }
      if (!validateRequire(obj.maxNumber)) {
        return false;
      }
      if (obj.placesLimit == 1) {
        if (obj.places == undefined || obj.places == "") {
          this.$message.error("活动名额不能为空");
          return false;
        }
      }
      // if (obj.paySet == 3) {
      //   if (obj.prepaidAmount == undefined || obj.prepaidAmount == "") {
      //     this.$message.error("预付金额不能为空");
      //     return false;
      //   } else if (obj.prepaidAmount * 1 > obj.floorPrice * 1) {
      //     this.$message.error("预付价必须小于活动价");
      //     return false;
      //   }
      // }
      return true;
    },
    ...mapMutations("helpCustom", ["setHelpCustom"]),
  },
  computed: {
    ...mapGetters([
      "getHelpCustomItem",
      "getHelpCustom",
      "getActivityStatus",
      "getMode",
    ]),
  },
};
</script>

<style lang="less" scoped>
.line {
  width: 100%;
  height: 0;
  margin-top: 18px;
  border-bottom: 1px solid #f0f0f0;
}
.label {
  margin-bottom: 6px;
  margin-top: 16px;
  color: #262626;
  font-size: 16px;
  font-weight: 500;
  span {
    font-weight: normal;
    font-size: 14px;
    color: #595959;
  }
}
.labelNum {
  margin-bottom: 6px;
  margin-top: 16px;
  color: #262626;
  font-size: 16px;
  font-weight: 500;
  span {
    font-weight: normal;
    font-size: 12px;
    color: #595959;
  }
  & + .ant-select {
    width: 100%;
  }
}
.block {
  width: 100%;
  min-height: 200px;
  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  b {
    font-weight: normal;
    color: #f84f43;
  }

  .title {
    height: 36px;
    background: #eafafa;
    display: flex;
    padding: 0 10px;
    line-height: 36px;
    justify-content: space-between;
  }
  .content {
    padding: 0 30px 16px 30px;
  }
}
.text {
  position: relative;
  span {
    color: #bfbfbf;
    position: absolute;
    bottom: 4px;
    right: 20px;
    s {
      color: #13c2c2;
      text-decoration: none;
    }
  }
}
.ant-select {
  width: 100%;
}
.smallInput {
  width: 60px;
  height: 26px;
  position: relative;
  top: 2px;
}
.row-top {
  margin-top: 18px;
  display: flex;
  align-items: center;
  .name {
    margin-right: 24px;
  }
}
.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}

.col-tips {
  font-size: 12px;
  color: #d45656;
  margin-top: 5px;
  &.t2 {
    color: #595959;
  }
}
.mt15 {
  margin-top: 15px;
}
.pt15 {
  padding-top: 15px;
}
.mt20 {
  margin-top: 20px;
}
.mt2 {
  margin-top: 2px;
}
.lineTop {
  border-top: 1px solid #f0f0f0;
}
.limitIcon {
  font-size: 14px;
  color: #d8d8d8;
}
</style>
