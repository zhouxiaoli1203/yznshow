<template>
  <div class="all" :class="{ s2: stype == 2 }">
    <div class="package" v-for="(item, index) in course" :key="index">
      <div class="title">
        {{ names(index) }}
      </div>
      <div
        v-if="(item.feeType === 0 || item.feeType == 1) && item.buyTime"
        class="course"
      >
        购买{{ item.buyTime }}课时
        <b v-if="item.giveTime">赠</b>
        <span v-if="item.giveTime">{{ item.giveTime }}课时</span>
      </div>
      <div v-if="item.feeType == 1 && item.schoolYear" class="year">
        {{ schoolYearName(item.schoolYear) }}
        {{ schoolTermName(item.schoolTermId) }}
      </div>
      <div v-if="item.feeType == 2" class="time">
        {{ item.beginTime && format(item.beginTime) }}
        <span v-if="item.beginTime">至</span>
        {{ item.endTime && format(item.endTime) }}
        <b v-if="item.giveTime">赠</b>
        <span v-if="item.giveTime">{{ item.giveTime }}天</span>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    course: {
      type: Array,
      default: [],
    },
    name: {
      type: String,
    },
    stype: {
      type: String,
      defalut: 1,
    },
  },
  data() {
    return {
      yearsList: [
        {
          name: "2020学年",
          value: 2020,
        },
        {
          name: "2019学年",
          value: 2019,
        },
        {
          name: "2021学年",
          value: 2022,
        },
        {
          name: "2022学年",
          value: 2022,
        },
      ],
      termsList: [
        {
          name: "春季",
          value: 3136,
        },
        {
          name: "秋季",
          value: 2,
        },
        {
          name: "春季",
          value: 3,
        },
        {
          name: "秋季",
          value: 4,
        },
      ],
    };
  },
  mounted() {
  },
  computed: {
    // courseName() {
    //   return (value) => {
    //     let obj =  this.courseList.find(i => i.value == value )
    //     return obj && obj.name
    //   }
    // },
    schoolYearName() {
      return (value) => {
        let obj = this.yearsList.find((i) => i.value == value);
        return obj && obj.name;
      };
    },
    schoolTermName() {
      return (value) => {
        let obj = this.termsList.find((i) => i.value == value);
        return obj && obj.name;
      };
    },
    format() {
      return (time) => {
        return moment(time).format("YYYY/MM/DD");
      };
    },
    names () {
      return (index) => {
        return this.course[index].courseName
      }
    }
  },
};
</script>

<style lang="less" scoped>
.all {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  &.s2 {
    margin-top: 8px;
    .package {
      // width: 339px;
      min-height: 50px;
      // box-shadow: 0px 1px 2px 0px #fbe2a4;
      border-radius: 4px;
      border: 1px solid #f2ebeb;
      margin-bottom: 5px;
      padding: 12px 15px;
      .title {
        font-size: 15px;
        line-height: 21px;
        margin-bottom: 7px;
      }
      .course {
        line-height: 22px;
        font-size: 12px;
        b {
          line-height: 19px;
          padding: 0 4px;
          margin-right: 3px;
        }
      }
      .year {
        line-height: 22px;
        font-size: 12px;
      }
      .time {
        font-size: 13px;
        line-height: 22px;
        b {
          line-height: 19px;
          padding: 0 4px;
          margin-right: 3px;
        }
      }
    }
  }
}
.package {
  // width: 678px;
  min-height: 100px;
  // box-shadow: 0px 2px 4px 0px #fbe2a4;
  border-radius: 8px;
  border: 2px solid #f2ebeb;
  margin-bottom: 10px;
  padding: 24px 30px;
  .title {
    font-size: 30px;
    color: #4d4d4d;
    line-height: 42px;
    margin-bottom: 14px;
  }
  .course {
    line-height: 44px;
    color: #595959;
    font-size: 24px;
    b {
      font-weight: normal;
      display: inline-block;
      line-height: 38px;
      padding: 0 8px;
      background: #d45656;
      color: #fff;
      margin-right: 6px;
    }
    span {
      color: #d45656;
    }
  }
  .year {
    line-height: 44px;
    color: #595959;
    font-size: 24px;
  }
  .time {
    font-size: 26px;
    color: #595959;
    line-height: 44px;
    b {
      font-weight: normal;
      display: inline-block;
      line-height: 38px;
      padding: 0 8px;
      background: #d45656;
      color: #fff;
      margin-right: 6px;
    }
    span {
      color: #d45656;
    }
  }
}
</style>