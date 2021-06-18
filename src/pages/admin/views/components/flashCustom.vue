<template>
  <div>
    <div
      class="course-package"
      v-for="(item, index) in getFlashCustom"
      :key="index"
    >
      <div class="title">
        <span>自定义{{ index + 1 }}</span>
        <a-popconfirm
          v-if="!isDisable('delete', getFlashCustom.length)"
          title="确定删除吗?"
          ok-text="是"
          cancel-text="否"
          @confirm="delPackageNow(index)"
        >
          <a-icon type="delete" />
        </a-popconfirm>
      </div>
      <div class="context">
        <a-row>
          <p class="formLabel">商品名称<span>(20字)</span><b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getPackageValidate('productName', index, {
                  rule: 'str',
                  len: 20,
                }) && !isValueNew('productName', index),
            }"
          >
            <a-input
              :disabled="isDisable()"
              size="large"
              :maxLength="20"
              placeholder="请填写商品名称"
              @change="setValue(index, 'productName', $event.target.value)"
              :value="getFlashCustomPackageItem('productName', index)"
            />
            <div
              class="form-err"
              ref="errRef"
              v-if="
                !getPackageValidate('productName', index, {
                  rule: 'str',
                  len: 20,
                }) && !isValueNew('productName', index)
              "
            >
              商品名称不能为空
            </div>
          </div>
        </a-row>
        <a-row class="text">
          <p class="formLabel">商品描述<b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getPackageValidate('productDesc', index, {
                  rule: 'str',
                  len: 200,
                }) && !isValueNew('productDesc', index),
            }"
          >
            <a-textarea
              :disabled="isDisable()"
              :rows="4"
              :maxLength="200"
              size="large"
              placeholder="请填写商品描述"
              @change="setValue(index, 'productDesc', $event.target.value)"
              :value="getFlashCustomPackageItem('productDesc', index)"
            />
            <div
              ref="errRef"
              class="form-err"
              v-if="
                !getPackageValidate('productDesc', index, {
                  rule: 'str',
                  len: 200,
                }) && !isValueNew('productDesc', index)
              "
            >
              商品描述不能为空
            </div>
          </div>
          <span
            ><s>{{ getFlashCustomPackageItem("productDesc", index).length }}</s
            >/200</span
          >
        </a-row>
        <a-row :gutter="16">
          <a-col span="12">
            <p class="formLabel">原价<span>(元)</span><b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('originalPrice', index) &&
                  !isValueNew('originalPrice', index),
              }"
            >
              <a-input
                :disabled="isDisable()"
                :maxLength="8"
                size="large"
                placeholder="请填写商品原价"
                @change="setValue(index, 'originalPrice', $event.target.value)"
                :value="getFlashCustomPackageItem('originalPrice', index)"
              />
              <div
                ref="errRef"
                class="form-err"
                v-if="
                  !getPackageValidate('originalPrice', index) &&
                  !isValueNew('originalPrice', index)
                "
              >
                商品原价不能为空
              </div>
            </div>
          </a-col>
          <a-col span="12">
            <p class="formLabel">活动价<span>(元)</span><b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('floorPrice', index) &&
                  !isValueNew('floorPrice', index),
              }"
            >
              <a-input
                :disabled="isDisable()"
                size="large"
                :maxLength="8"
                placeholder="请填写商品活动价"
                @change="setValue(index, 'floorPrice', $event.target.value)"
                :value="getFlashCustomPackageItem('floorPrice', index)"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('floorPrice', index) &&
                  !isValueNew('floorPrice', index)
                "
              >
                商品活动价不能为空
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row >
          <a-col span="6">
            <p class="formLabel">
              新老生参与限制
              <a-tooltip>
                <template slot="title">新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template>
                <a-icon type="question-circle" class="limitIcon" theme='filled' />
              </a-tooltip>
            </p>
          </a-col>
          <a-col span="12">
            <a-switch
              class="stuLimit"
              :disabled="isDisable()"
              :checked="Boolean(getFlashCustomPackageItem('limitItems', index))"
              @change="setValue(index, 'limitItems', Number($event))"
            />
          </a-col>
        </a-row>
        <a-row v-if="getFlashCustomPackageItem('limitItems', index)">
          <a-col class="hei">
            <a-radio-group
              :disabled="isDisable()"
              name="radioGroup"
              @change="setValue(index, 'limitItems', $event.target.value)"
              :value="getFlashCustomPackageItem('limitItems', index)"
            >
              <a-radio :value="1">仅允许新生参与活动</a-radio>
              <a-radio :value="2">仅允许老生参与活动</a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
        <a-row class="lineTop">
          <a-col span="4"><p class="noBot">活动名额</p></a-col>
          <a-col span="20" class="mt14">
            <a-radio-group
              size="large"
              :disabled="isDisable('placesLimit', index)"
              @change="setValue(index, 'placesLimit', $event.target.value)"
              :value="getFlashCustomPackageItem('placesLimit', index)"
            >
              <a-radio :value="0">
                <span
                  :class="{
                    'ac-text':
                      getFlashCustomPackageItem('placesLimit', index) === 0,
                  }"
                  >不限</span
                >
              </a-radio>
              <a-radio :value="1">
                <span
                  :class="{
                    'ac-text':
                      getFlashCustomPackageItem('placesLimit', index) == 1,
                  }"
                  >仅限</span
                >
                <a-input
                  :disabled="isDisable('places', index)"
                  style="width: 60px; height: 26px"
                  @change="setValue(index, 'places', $event.target.value)"
                  :value="getFlashCustomPackageItem('places', index)"
                />
                <span
                  :class="{
                    'ac-text':
                      getFlashCustomPackageItem('placesLimit', index) == 1,
                  }"
                  >名</span
                >
              </a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </div>
    </div>
    <div>
      <a-button
        :disabled="isDisable()"
        type="primary"
        icon="plus"
        class="add-package"
        ghost
        @click="addPackageNow"
        >新增自定义项</a-button
      >
    </div>
    <div class="bottomLimit">
      <a-row>
        <a-col span="4">
          <p>开启每人限购</p>
        </a-col>
        <a-col span="20" class="mt2">
          <a-switch
            :disabled="isDisable()"
            :checked="Boolean(getSignUpLimit)"
            @change="setSignUpLimit($event)"
          />
        </a-col>
      </a-row>
      <a-row v-if="getSignUpLimit">
        <a-col span="4">
          <p>参与限制</p>
        </a-col>
        <a-col span="20">
          每个学员最多报
          <a-input
            :disabled="isDisable()"
            type="number"
            ref="sss"
            :maxLength="4"
            @change="setLimitNum($event.target.value.replace(/\D/g, ''))"
            :value="getLimitNum"
          />
          项
        </a-col>
      </a-row>
    </div>
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
import moment from "moment";
export default {
  created() {
    let copy = JSON.parse(JSON.stringify(this.getFlashCustom));
    for (let i of copy) {
      for (let item in i) {
        if (Array.isArray(i[item])) {
          for (let one of i[item]) {
            for (let j in one) {
              one[j] = true;
            }
          }
        } else {
          i[item] = true;
        }
      }
    }
    this.isNew = copy;
    this.mode = this.$route.query.mode == 2 ? true : false;
  },
  data() {
    return {
      mode: true,
      isNew: [],
      //oldPlaces: "",
      packages: [],
    };
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getFlashCustom);

      let copy = JSON.parse(JSON.stringify(this.getFlashCustom));
      for (let i of copy) {
        for (let item in i) {
          if (Array.isArray(i[item])) {
            for (let one of i[item]) {
              for (let j in one) {
                one[j] = true;
              }
            }
          } else {
            i[item] = true;
          }
        }
      }
      this.isNew = copy;
    }, 800);
  },
  methods: {
    getPackageValidate(name, index, rule) {
      let c = this.getFlashCustomPackageItem(name, index);
      if (!rule) {
        return validateRequire(c);
      } else if (rule.rule == "float") {
        return validateFloat(c);
      } else if (rule.rule == "str") {
        return validateStringLen(c, rule.len);
      }
    },
    isValueNew(name, index) {
      if (this.isNew[index][name] !== false) {
        return true;
      }
    },
    setValue(index, name, value) {
      // 两位小数
      if (
        name == "originalPrice" ||
        name == "floorPrice" ||
        name == "prepaidAmount"
      ) {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      // 整数
      if (name == "places") {
        value = String(value).replace(/\D/g, "");
        //this.oldPlaces = this.getFlashCustomPackageItem("places", index);
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
      let isnew = this.isNew;
      let pack = isnew[index];
      pack && (pack[name] = false);
      this.isNew = isnew;
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
    addPackageNow() {
      this.addPackage();
      let news = this.isNew;
      news.push({
        productName: true,
        productDesc: true,
        originalPrice: true,
        floorPrice: true,
        limitItems: true,
        placesLimit: true,
        places: true,
        paySet: true,
        prepaidAmount: true,
      });
      this.isNew = news;
    },
    delPackageNow(index) {
      let news = this.isNew;
      news.splice(index, 1);
      this.isNew = news;
      this.deletePackageByIndex(index);
    },
    validate() {
      let arr = [];
      this.isNew.map((item) => {
        let obj = {};
        for (let key in item) {
          obj[key] = false;
        }
        arr.push(obj);
      });
      this.isNew = arr;
      this.$forceUpdate();
      let packages = this.getFlashCustom;
      for (let i = 0; i < packages.length; i++) {
        let obj = packages[i];
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
            if (
              obj.places * 1 <
              this.getFlashCustomPackageItem("oldPlaces", i)
            ) {
              this.$message.error("开始后名额不能减少");
              this.setValue(
                i,
                "places",
                this.getFlashCustomPackageItem("oldPlaces", i)
              );
              return false;
            }
          }
        }
      }
      if (this.getSignUpLimit && !this.getLimitNum) {
        this.$message.error("参与限制数最不能为空");
        return false;
      }
      if (this.getLimitNum > packages.length) {
        this.$message.error("参与限制数最大不能超过商品总数");
        this.setLimitNum();
        this.$refs.sss.focus();
        return false;
      }
      return true;
    },

    isDisable(name, index) {
      if (name == "places") {
        if (this.getFlashCustomPackageItem("placesLimit", index) == 0) {
          return true;
        }
      }
      if (name == "delete" && index <= 1) {
        return true;
      }
      if (this.getMode == 1) {
        return false;
      }
      if (this.getActivityStatus == 2 || this.getActivityStatus == 3) {
        if (name == "placesLimit") {
          return false;
        } else if (name == "places") {
          if (this.getFlashCustomPackageItem("placesLimit", index) == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
    },
    ...mapActions("flashCustom", [
      "setPackagesItemByName",
      "addPackage",
      "deletePackageByIndex",
    ]),
    ...mapMutations("common", ["setLimitNum", "setSignUpLimit"]),
  },
  computed: {
    ...mapGetters([
      "getMode",
      "getFlashCustom",
      "getFlashCustomPackageItem",
      "getFlashCustomItem",
      "getActiveType",
      "getActivityStatus",
      "getSignUpLimit",
      "getLimitNum",
    ]),
  },
};
</script>

<style lang='less' scoped>
.course-package {
  width: 100%;
  min-height: 200px;

  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
  .title {
    height: 36px;
    background: #eafafa;
    display: flex;
    padding: 0 10px;
    line-height: 36px;
    justify-content: space-between;
    i {
      line-height: 36px;
      color: #acacac;
      &:hover,
      &:active {
        color: #ff9537;
        cursor: pointer;
      }
    }
  }
  .context {
    margin: 0 30px 16px;
    .rowTop {
      margin-top: 16px;
    }
    .rowText {
      line-height: 24px;
      margin-bottom: 0px;
    }
    p {
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
      b {
        font-weight: normal;
        color: #f84f43;
      }
    }
  }
}
.add-package {
  margin-bottom: 20px;
  box-shadow: none;
}
.addNote {
  float: right;
  color: #595959;
  font-size: 14px;
}
.bottomLimit {
  .ant-input {
    width: 60px;
  }
  margin-bottom: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
  p {
    color: #262626;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 0;
    line-height: 32px;
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
.ac-text {
  color: #36cfc9;
}
.ant-radio-wrapper-disabled /deep/ .ac-text {
  color: #d9d9d9;
}
.ant-switch {
  margin-top: 2px;
  margin-left: 18px;
}
.mt2 {
  margin-top: 2px;
}
.stuLimit {
  margin-top: 16px;
}
.course-package .context .noBot {
  margin-bottom: 0;
}
.limitIcon {
  font-size: 14px;
  color: #d8d8d8;
}
.hei {
  line-height: 40px;
}
.lineBot {
  border-bottom: 1px solid #f0f0f0;
}
.lineTop {
  border-top: 1px solid #f0f0f0
}
.mt14 {
  margin-top: 14px;
}
</style>