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
              :maxLength="20"
              :disabled="isDisable()"
              size="large"
              placeholder="请填写商品名称"
              @change="setValue('productName', $event.target.value)"
              :value="getBargainCustomItem('productName')"
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
              placeholder="请填写商品描述"
              :rows="4"
              :maxLength="200"
              @change="setValue('productDesc', $event.target.value)"
              :value="getBargainCustomItem('productDesc')"
            />
            <div
              class="form-err"
              v-if="
                !getPackageValidate('productDesc') && !isValueNew('productDesc')
              "
            >
              请填写商品描述(200字内)
            </div>
          </div>
          <span
            ><s>{{ getBargainCustomItem("productDesc").length }}</s
            >/200</span
          >
        </a-row>
        <a-row>
          <a-col>
            <p class="label">原价(元)<b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('originalPrice') &&
                  !isValueNew('originalPrice'),
              }"
            >
              <a-input
                type="number"
                :disabled="isDisable()"
                :maxLength="7"
                size="large"
                placeholder="请填写商品原价"
                @change="setValue('originalPrice', $event.target.value)"
                :value="getBargainCustomItem('originalPrice')"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('originalPrice') &&
                  !isValueNew('originalPrice')
                "
              >
                请填写商品原价
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <p class="label">砍价底价(元)<b>*</b></p>
            <div
              :class="{
                'form-err-group':
                  !getPackageValidate('floorPrice') &&
                  !isValueNew('floorPrice'),
              }"
            >
              <a-input
                :disabled="isDisable()"
                :maxLength="7"
                size="large"
                placeholder="请填写砍价底价"
                :value="getBargainCustomItem('floorPrice')"
                @change="setValue('floorPrice', $event.target.value)"
              />
              <div
                class="form-err"
                v-if="
                  !getPackageValidate('floorPrice') && !isValueNew('floorPrice')
                "
              >
                砍价底价不能为空
              </div>
            </div>
            <div class="col-tips">
              (注：用户未砍至底价，仍可以按砍价结果价下单购买)
            </div>
          </a-col>
        </a-row>
        <a-row>
          <p class="label">砍价次数<b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getPackageValidate('totalNum') && !isValueNew('totalNum'),
            }"
          >
            <a-input
              :disabled="isDisable()"
              :maxLength="4"
              size="large"
              placeholder="请填写砍价次数"
              @change="setValue('totalNum', $event.target.value)"
              :value="getBargainCustomItem('totalNum')"
            />
            <div
              class="form-err"
              v-if="!getPackageValidate('totalNum') && !isValueNew('totalNum')"
            >
              砍价次数不能为空
            </div>
          </div>
          <div class="col-tips">
            (注：砍价次数为从原价到底价一共要砍价的次数)
          </div>
        </a-row>
      </div>
    </div>
    <a-row class="mt20">
      <a-col span="6">
        新老生参与限制
        <a-tooltip>
          <template slot="title">新生表示从未在机构报读过的学员，老生表示在读学员和历史学员</template>
          <a-icon type="question-circle" theme='filled' class="limitIcon"/>
        </a-tooltip>
      </a-col>
      <a-col span="12">
        <a-switch
          class="stuLimit"
          :disabled="isDisable()"
          :checked="Boolean(getBargainCustomItem('limitItems'))"
          @change="setValue('limitItems', Number($event))"
        />
      </a-col>
    </a-row>
    <a-row v-if="getBargainCustomItem('limitItems')" class="mt20">
      <a-col class="hei">
        <a-radio-group
          :disabled="isDisable()"
          name="radioGroup"
          @change="setValue('limitItems', $event.target.value)"
          :value="getBargainCustomItem('limitItems')"
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
          :value="getBargainCustomItem('placesLimit')"
        >
          <a-radio :value="0">
            <span
              :class="{
                'ac-text': getBargainCustomItem('placesLimit') === 0,
              }"
              >不限</span
            >
          </a-radio>
          <a-radio :value="1">
            <span
              :class="{
                'ac-text': getBargainCustomItem('placesLimit') == 1,
              }"
              >仅限</span
            >
            <!-- @blur="checkNumber($event, 0)" -->
            <a-input
              type="number"
              :disabled="isDisable('places')"
              style="width: 60px; height: 26px"
              @change="setValue('places', $event.target.value)"
              :value="getBargainCustomItem('places')"
            />
            <span
              :class="{
                'ac-text': getBargainCustomItem('placesLimit') == 1,
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
import { mapActions, mapGetters, mapMutations } from "vuex";
import cloneDeep from "lodash/cloneDeep";
import {
  validateInteger,
  validateRequire,
  validateFloat,
  validateStringLen,
} from "@/utils/validate.js";
export default {
  created() {
    let copy = JSON.parse(JSON.stringify(this.getBargainCustom));
    for (let i in copy) {
      copy[i] = true;
    }
    this.isNew = copy;
  },
  mounted() {
    setTimeout(() => {
      this.packages = cloneDeep(this.getBargainCustom);
    }, 800);
  },
  data() {
    return {
      isChecked: true,
      oldPlaces: "",
      packages: {},
      // oldPre: ''
    };
  },
  methods: {
    getPackageValidate(name) {
      let c = this.getBargainCustomItem(name);
      if (name == "floorPrice") {
        return validateRequire(c);
      } else if (name == "productName") {
        return validateStringLen(c, 20);
      } else if (name == "totalNum") {
        return validateInteger(c);
      } else if (name = "productDesc") {
        return validateStringLen(c, 200);
      } else if ( name == "originalPrice") {
        console.log('aaaaa')
        return validateRequire(c);
      }
    },
    isDisable(name) {
      if (name == "places") {
        if (this.getBargainCustomItem("placesLimit") == 0) {
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
          if (this.getBargainCustomItem("placesLimit") == 1) {
            return false;
          }
          return true;
        }
        return true;
      }
    },
    isValueNew(name) {
      if (this.isNew[name] !== false) {
        return true;
      }
    },
    setValue(name, value) {
      if (name == "places" || name == "totalNum") {
        value = value.replace(/\D/g, "");
      }
      if (
        name == "floorPrice" ||
        name == "originalPrice"
      ) {
        value = value.match(/^\d*(\.?\d{0,2})/g)[0] || null;
      }
      if (name == "places") {
        this.oldPlaces = this.getBargainCustomItem("places");
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
      this.setBargainCustom({
        name,
        value,
      });
      this.$forceUpdate();
      let isnew = this.isNew;
      isnew[name] = false;
      this.isNew = isnew;
    },
    validate() {
      let arr = {};
      Object.keys(this.isNew).forEach((i) => {
        arr[i] = false;
      });
      this.isNew = arr;
      this.$forceUpdate();
      let obj = this.getBargainCustom;
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
        this.$message.error("砍价底价必须小于原价");
        return false;
      }
      if (!validateInteger(obj.totalNum)) {
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
      //     this.$message.error("预付价不能大于砍价底价");
      //     return false;
      //   }
      // }
      return true;
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
    //   if (val > this.getBargainCustomItem("floorPrice")) {
    //     this.$message.error("预付价不能大于活动价");
    //     this.setValue( "prepaidAmount",  this.getBargainCustomItem('floorPrice') );
    //   }
    // },
    ...mapMutations("bargainCustom", ["setBargainCustom"]),
  },
  computed: {
    ...mapGetters([
      "getBargainCustomItem",
      "getBargainCustom",
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
.ant-select {
  width: 300px;
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