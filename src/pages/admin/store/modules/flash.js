import moment from 'moment'
const state = {
  // activeType: 2,  //活动类型
  // activeContent: 1,  // 活动内容 1自定义 2 课程
  // name: '',
  // startTime: '',
  // endTime: '',
  packages: [{
    course: [{
      courseId: '',    // 课程id
      courseName: '',  // 课程名
      packageId: '',   // 套餐id
      // packageName: '', // 套餐名
      feeType: 0,      // 收费方式
      coursePrice: '', // 原价
      buyTime: '',     // 购买课时
      giveTime: '',    // 赠送课时
      giveDate: '',    // 赠送天数
      schoolYear: '',  // 学年
      schoolTermId: '',// 学期
      beginTime: null,   // 开始时间
      endTime: null,     // 结束时间
    }],
    productName: '',
    floorPrice: '',
    limitItems: 0,
    placesLimit: 1,
    places: 40,
    oldPlaces: '',
    paySet: 2,
    // price: '',
    // limit: '',

    // quota: '',
    // quotaNum: '',
  }]
}

const mutations = {
  // setActiveType(state, name) {
  //   state.activeType = name;//将传参设置给state的city
  // },
  // setActiveContent(state, name) {
  //   state.activeContent = name;//将传参设置给state的city
  // },
  // setName(state, name) {
  //   return state.name = name
  // },
  // setStartTime(state, time) {
  //   return state.startTime = time
  // },
  // setEndTime(state, time) {
  //   return state.endTime = time
  // },
  setPackages(state, packages) {
    return state.packages = [...packages]
  },
  // initPackage (state, packages) {
  //   packages.forEach(i => {
  //     i['course'] = [...i.showActivityCourseList]
  //   })
  //   commit('setPackages', packages)
  //   // console.log(packages)
  //   // state.packages = [...packages]
  // }
}

const actions = {
  initPackage({ commit, state }, payload) {
    let arr = []
    for (let i of payload) {
      let p = {
        productName: i.productName !== undefined ? i.productName : '',
        floorPrice: i.floorPrice !== undefined ? i.floorPrice : '',
        limitItems: i.limitItems !== undefined ? i.limitItems : '',
        placesLimit: i.placesLimit !== undefined ? i.placesLimit : '',
        places: i.places !== undefined ? i.places : '',
        oldPlaces: i.places !== undefined ? i.places : '',
        paySet: 2,
        course: i.showActivityCourseList || [{
          courseId: '',    // 课程id
          courseName: '',  // 课程名
          packageId: '',   // 套餐id
          feeType: 0,      // 收费方式
          coursePrice: '', // 原价
          buyTime: '',     // 购买课时
          giveTime: '',    // 赠送课时
          schoolYear: '',  // 学年
          schoolTermId: '',// 学期
          beginTime: null,   // 开始时间
          endTime: null     // 结束时间
        }]
      }
      let c = []
      if (i.showActivityCourseList && i.showActivityCourseList.length) {
        for (let k of p.course) {
          for (let key in k) {
            if (key == 'beginTime' || key == 'endTime') {
              if (k[key]) {
                k[key] = moment(k[key] || null)
              }

            }
          }

          let obj = Object.assign({
            courseId: '',    // 课程id
            courseName: '',  // 课程名
            packageId: '',   // 套餐id
            feeType: 0,      // 收费方式
            coursePrice: '', // 原价
            buyTime: '',     // 购买课时
            giveTime: '',    // 赠送课时
            schoolYear: '',  // 学年
            schoolTermId: '',// 学期
            beginTime: null,   // 开始时间
            endTime: null,     // 结束时间
          }, k)
          delete obj.activityCourseId
          c.push(obj)
        }
      }
      p.course = c
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
    let c = obj.course
    let c_item = c[courseIndex]
    c_item[name] = value
    commit('setPackages', p)
  },

  addPackage({ commit, state }) {
    let p = [...state.packages]
    p.push({
      course: [{
        courseName: '',
        courseId: '',    // 课程id
        packageId: '',   // 套餐id
        feeType: 0,      // 收费方式
        coursePrice: '', // 原价
        buyTime: '',     // 购买课时
        giveTime: '',    // 赠送课时
        schoolYear: '',  // 学年
        schoolTermId: '',// 学期
        beginTime: null,   // 开始时间
        endTime: null,     // 结束时间
      }],
      productName: '',
      floorPrice: '',
      limitItems: 0,
      paySet: 2,
      placesLimit: 0,
      places: '',
      oldPlaces: '',
    })
    commit('setPackages', p)
  },
  addCourseByIndex({ commit, state }, packageIndex) {
    let packages = state.packages
    let p = packages[packageIndex]
    let course = p.course
    course.push({
      // courseName: '',
      // courseId: '',
      // packageId: '',
      // feeType: 0,
      // coursePrice: '',
      // buyTime: '',
      // giveTime: '',
      courseName: '',
      courseId: '',    // 课程id
      packageId: '',   // 套餐id
      feeType: 0,      // 收费方式
      coursePrice: '', // 原价
      buyTime: '',     // 购买课时
      giveTime: '',    // 赠送课时
      schoolYear: '',  // 学年
      schoolTermId: '',// 学期
      beginTime: null,   // 开始时间
      endTime: null,     // 结束时间
    })
    commit('setPackages', packages)
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
    let course = p.course
    if (!course.length || course.length <= 1) {
      return
    } else {
      course.splice(courseIndex, 1)
      commit('setPackages', packages)
    }
  },
  cleanCourse({ commit, state }, payload) {
    const { index, courseIndex } = payload
    let p = state.packages
    let obj = p[index]
    let c = obj.course
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
    let c = obj.course
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