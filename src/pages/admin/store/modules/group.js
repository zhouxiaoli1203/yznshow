import moment from 'moment'
const state = {
  packages: [{
    // 课程
    courseInfo: [{
      courseName: '',
      courseId: '',    // 课程id
      packageId: '',   // 套餐id
      feeType: 0,      // 收费方式
      coursePrice: '', // 原价
      buyTime: '',     // 购买课时
      giveTime: '',    // 赠送课时
      schoolYear: '',  // 学年
      schoolTermId: '',// 学期
      beginTime: '',   // 开始时间
      endTime: '',     // 结束时间
    }],
    // 梯度
    showContentRuleList: [{
      number: '',
      price: ''
    }],
    productName: '',  // 商品名称
    limitItems: 0,    // 拼团限制
    placesLimit: 1,   // 名额限制
    places: 40,        // 名额人数
    paySet: 2,        // 支付方式
    prepaidAmount: '', // 预付金额
    //virtualGroup: 1,   // 虚拟成团
  }]
}

const mutations = {
  setPackages(state, packages) {
    return state.packages = [...packages]
  }
}

const actions = {
  initPackage({ commit, state }, payload) {
    let arr = []
    for (let i of payload) {
      let p = {
        productName: i.productName !== undefined ? i.productName : '',
        limitItems: i.limitItems !== undefined ? i.limitItems : '',
        placesLimit: i.placesLimit !== undefined ? i.placesLimit : '',
        places: i.places !== undefined ? i.places : '',
        paySet: i.paySet !== undefined ? i.paySet : '',
        prepaidAmount: i.prepaidAmount !== undefined ? i.prepaidAmount : '',
        //virtualGroup: i.virtualGroup !== undefined ? i.virtualGroup : '',
        showContentRuleList: i.showContentRuleList || [],

        courseInfo: i.showActivityCourseList || [{
          courseName: '',
          courseId: '',    // 课程id
          packageId: '',   // 套餐id
          feeType: 0,      // 收费方式
          coursePrice: '', // 原价
          buyTime: '',     // 购买课时
          giveTime: '',    // 赠送课时
          schoolYear: '',  // 学年
          schoolTermId: '',// 学期
          beginTime: '',   // 开始时间
          endTime: '',     // 结束时间
        }]
      }
      let c = []
      if (i.showActivityCourseList && i.showActivityCourseList.length) {
        for (let k of p.courseInfo) {
          for (let key in k) {
            if (key == 'beginTime' || key == 'endTime') {
              if (k[key]) {
                k[key] = moment(k[key]||null)
              }
             
            }
          }
          let obj = Object.assign({
            courseName: '',
            courseId: '',    // 课程id
            packageId: '',   // 套餐id
            feeType: 0,      // 收费方式
            coursePrice: '', // 原价
            buyTime: '',     // 购买课时
            giveTime: '',    // 赠送课时
            schoolYear: '',  // 学年
            schoolTermId: '',// 学期
            beginTime: '',   // 开始时间
            endTime: '',     // 结束时间
          }, k)
          delete obj.activityCourseId
          c.push(obj)
        }
      }
      p.courseInfo = c
      arr.push(p)
    }
    commit('setPackages', arr)
  },
  setPackagesItemByName({ commit, state }, payload) {
    const { index, name, value } = payload
    let p = state.packages
    let obj = p[index]
    obj[name] = value
    commit('setPackages', p)
  },

  setPackageCourseItemByName({ commit, state }, payload) {
    const { index, courseIndex, name, value } = payload
    let p = state.packages
    let obj = p[index]
    let c = obj.courseInfo
    let c_item = c[courseIndex]
    c_item[name] = value
    commit('setPackages', p)
  },

  setPackageRuleByName({ commit, state }, payload) {
    const { index, ruleIndex, name, value } = payload
    let p = state.packages
    let obj = p[index]
    let c = obj.showContentRuleList
    let c_item = c[ruleIndex]
    c_item[name] = value
    commit('setPackages', p)
  },

  addPackage({ commit, state }) {
    let p = state.packages
    p.push({
      courseInfo: [{
        courseName: '',
        courseId: '',    // 课程id
        packageId: '',   // 套餐id
        feeType: 0,      // 收费方式
        coursePrice: '', // 原价
        buyTime: '',     // 购买课时
        giveTime: '',    // 赠送课时
        schoolYear: '',  // 学年
        schoolTermId: '',// 学期
        beginTime: '',   // 开始时间
        endTime: '',     // 结束时间
      }],
      // 梯度
      showContentRuleList: [{
        number: '',
        price: ''
      }],
      productName: '',  // 商品名称
      limitItems: 0,    // 拼团限制
      placesLimit: 1,   // 名额限制
      places: 40,        // 名额人数
      paySet: 2,        // 拼团限制
      prepaidAmount: '', // 预付金额
      //virtualGroup: 1,   // 虚拟成团
    })
    commit('setPackages', p)
  },

  addCourseByIndex({ commit, state }, index) {
    let p = state.packages
    let courseInfo = p[index].courseInfo
    courseInfo.push({
      courseName: '',
      courseId: '',    // 课程id
      packageId: '',   // 套餐id
      feeType: 0,      // 收费方式
      coursePrice: '', // 原价
      buyTime: '',     // 购买课时
      giveTime: '',    // 赠送课时
      schoolYear: '',  // 学年
      schoolTermId: '',// 学期
      beginTime: '',   // 开始时间
      endTime: '',     // 结束时间
    })
    commit('setPackages', p)
  },

  deletePackageByIndex({ commit, state }, packageIndex) {
    let p = state.packages
    if (p.length <= 1) {
      return
    } else {
      p.splice(packageIndex, 1)
      commit('setPackages', p)
    }
  },

  deleteCourseByIndex({ commit, state }, payload) {
    const { packageIndex, courseIndex } = payload
    let packages = state.packages
    let p = packages[packageIndex]
    let course = p.courseInfo
    if (!course.length || course.length <= 1) {
      return
    } else {
      course.splice(courseIndex, 1)
      commit('setPackages', packages)
    }
  },

  deleteRuleByIndex({ commit, state }, payload) {
    const { packageIndex, ruleIndex } = payload
    let packages = state.packages
    let p = packages[packageIndex]
    let rule = p.showContentRuleList
    if (!rule.length || rule.length <= 1) {
      return
    } else {
      rule.splice(ruleIndex, 1)
      commit('setPackages', packages)
    }
  },

  addRuleByIndex({ commit, state }, index) {
    let p = state.packages
    let rule = p[index].showContentRuleList
    rule.push({
      number: '',
      price: ''
    })
    commit('setPackages', p)
  },

  setRule({ commit, state }, payload) {
    const { index, ruleIndex, number, price } = payload
    let packages = state.packages
    let p = packages[index]
    let rule = p.showContentRuleList[ruleIndex]
    if (number !== undefined) {
      rule.number = number
    }
    if (price !== undefined) {
      rule.price = price
    }
    commit('setPackages', packages)
  },

  cleanCourse ({commit, state}, payload) {
    const { index, courseIndex } = payload
    let p = state.packages
    let obj = p[index]
    let c = obj.courseInfo
    let course = c[courseIndex]
    course.packageId = ''
    course.coursePrice = '' // 原价
    course.buyTime = ''     // 购买课时
    course.giveTime = ''    // 赠送课时
    course.schoolYear = ''  // 学年
    course.schoolTermId = ''// 学期
    course.beginTime = null   // 开始时间
    course.endTime = null    // 结束时间
    commit('setPackages', p)
  },

  cleanPackage({ commit, state }, payload) {
    const { index, courseIndex } = payload
    let p = state.packages
    let obj = p[index]
    let c = obj.courseInfo
    let course = c[courseIndex]
    if (!course.packageId) {
      return
    }
    course.packageId = ''
    commit('setPackages', p)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}