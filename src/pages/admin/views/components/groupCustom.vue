<template>
  <div>
    <group-base v-slot="slotProps" ref="groupBase" @addGroupCustom="addIsNew">
      <div>
        <a-row class="text">
          <p>商品描述<b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getValidate('productDesc', slotProps.groupPackageIndex) &&
                !isValueNew('productDesc', slotProps.groupPackageIndex),
            }"
          >
            <a-textarea
              size="large"
              placeholder="请填写商品名称"
              :auto-size="{ minRows: 4, maxRows: 8 }"
              :maxLength="200"
              :disabled="
                (getActivityStatus == 2 || getActivityStatus == 3) &&
                getMode != 1
              "
              @change="
                setValue(
                  slotProps.groupPackageIndex,
                  'productDesc',
                  $event.target.value
                )
              "
              :value="
                getGroupCustomItem('productDesc', slotProps.groupPackageIndex)
              "
            />
            <div
              class="form-err"
              v-if="
                !getValidate('productDesc', slotProps.groupPackageIndex) &&
                !isValueNew('productDesc', slotProps.groupPackageIndex)
              "
            >
              请输入商品描述
            </div>
          </div>
          <span
            ><s>{{
              getGroupCustomItem("productDesc", slotProps.groupPackageIndex)
                .length
            }}</s
            >/200</span
          >
        </a-row>
        <a-row>
          <p>原价<span>(元)</span><b>*</b></p>
          <div
            :class="{
              'form-err-group':
                !getValidate('originalPrice', slotProps.groupPackageIndex) &&
                !isValueNew('originalPrice', slotProps.groupPackageIndex),
            }"
          >
            <a-input
              :maxLength="7"
              size="large"
              :disabled="
                (getActivityStatus == 2 || getActivityStatus == 3) &&
                getMode != 1
              "
              @change="
                setValue(
                  slotProps.groupPackageIndex,
                  'originalPrice',
                  $event.target.value
                )
              "
              :value="
                getGroupCustomItem('originalPrice', slotProps.groupPackageIndex)
              "
              placeholder="请填写商品原价"
            />
            <div
              class="form-err"
              v-if="
                !getValidate('originalPrice', slotProps.groupPackageIndex) &&
                !isValueNew('originalPrice', slotProps.groupPackageIndex)
              "
            >
              请输入原价
            </div>
          </div>
        </a-row>
        <div class="line"></div>
      </div>
    </group-base>
  </div>
</template>

<script>
import GroupBase from "./groupBase.vue";
import { validateFloat, validateRequire, validateStringLen } from "../../../../utils/validate";

import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  created() {
    // let copy = JSON.parse(JSON.stringify(this.getGroupCustom));
    // for (let i of copy) {
    //   for (let item in i) {
    //     if (Array.isArray(i[item])) {
    //       for (let one of i[item]) {
    //         for (let j in one) {
    //           one[j] = true;
    //         }
    //       }
    //     } else {
    //       i[item] = true;
    //     }
    //   }
    // }
    // this.isNew = copy;
  },
  data() {
    return {
      isChecked: true,
      isNew: [
        {
          productDesc: true,
          originalPrice: true,
        },
      ],
    };
  },
  mounted() {
    setTimeout(() => {
      let len = this.getGroupCustom.length;
      let isNew = [];
      for (let i = 0; i < len; i++) {
        isNew.push({
          productDesc: true,
          originalPrice: true,
        });
      }
      this.isNew = isNew
    }, 800);
  },
  methods: {
    getValidate(name, index) {
      let c = this.getGroupCustomItem(name, index);
      if (name == "originalPrice" && !c) {
        return false
      } else if (name == "productDesc") {
        return validateStringLen(c, 200);
      }
      return true;
    },
    addIsNew(v) {
      this.isNew = v;
    },
    isValueNew(name, index) {
      if (this.isNew[index][name] !== false) {
        return true;
      }
    },
    setValue(index, name, value) {
      if (name == 'originalPrice') {
        value = (value.match(/^\d*(\.?\d{0,2})/g)[0]) || null
      }
      this.setGroupValue({
        index,
        name,
        value,
      });
      let isnew = this.isNew;
      let pack = isnew[index];
      pack[name] = false;
      this.isNew = isnew;
    },
    ...mapActions("groupCustom", {
      setGroupValue: "setPackagesItemByName",
    }),
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

      let c = this.$refs.groupBase.validate();
      if (!c) {
        return false;
      }
      let p = this.getGroupCustom;
      for (let i = 0; i < p.length; i++) {
        let obj = p[i];
        if (!validateStringLen(obj.productDesc, 200)) {
          return false;
        }
        if (!validateRequire(obj.originalPrice)) {
          return false;
        }
        if (obj.placesLimit == 1) {
          if (obj.places == undefined || obj.places == "") {
            this.$message.error("活动名额不能为空");
            return false;
          }
        }
        if (obj.paySet == 3) {
          if (obj.prepaidAmount == undefined || obj.prepaidAmount == "") {
            this.$message.error("预付金额不能为空");
            return false;
          }
        }
      }

      return true;
    },
  },
  computed: {
    ...mapGetters([
      "getGroupCustomItem",
      "getGroupCustom",
      "getActivityStatus",
      "getMode",
    ]),
  },
  components: {
    GroupBase,
  },
};
</script>

<style lang="less" scoped>
.course-package {
  width: 100%;
  min-height: 200px;

  background: #ffffff;
  box-shadow: 0px 2px 10px 0px rgba(228, 228, 228, 0.54);
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  margin-bottom: 20px;
  b {
    font-weight: normal;
    color: #f84f43;
  }

  .context {
    margin: 0 20px 16px;
    p {
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
    }
  }
  .ant-select {
    width: 100%;
  }

  .col-info {
    height: 22px;
    font-size: 14px;
    font-weight: 400;
    color: #595959;
    line-height: 22px;
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
.line {
  width: 100%;
  height: 0;
  margin-top: 18px;
  border-bottom: 1px solid #f0f0f0;
}
textarea.ant-input {
  padding-bottom: 28px;
}
</style>