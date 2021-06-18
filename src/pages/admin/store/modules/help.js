import moment from 'moment'
const state = {
  // 课程
  productName: '',
  floorPrice: '',// 活动价
  limitItems: 0,// 活动限制 0：不限制 1：[已签约学员只能开团不能参团/仅允许未签约的学员参与活动报名] 2：[已有潜客、已签约学员只能开团不能参团/仅允许已签约的学员参与活动报名]
  placesLimit: 1,// 活动名额限制 0：不限制 1：限制
  places: 40,// 活动名额限制数
  paySet: 2,// 活动支付设置 1：线下 2：砍价结果价 3：预付
  //prepaidAmount: '',// 活动预付金额
  packagesNumber: '',// 助力包数
  maxNumber: 8,// 单次最大助力包数
  // payDeadline: '', // 付款截至时间
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
    beginTime: '',   // 开始时间
    endTime: '',     // 结束时间
  }]


}

const mutations = {
  setHelp(state, { name, value }) {
    return state[name] = value
  },
  setPackages(state, packages) {
    for (let key in packages) {
      if (key !== 'showActivityCourseList'){
        state[key] = packages[key]
      } else {
        let course = packages['showActivityCourseList']
        for (let c of course) {
          for (let i in c) {
            if (i == 'beginTime' || i == 'endTime') {
              c[i] = moment(c[i] || null)
            }
          }
        }
        state.course = [...course]
      }
    }
  }
}

const actions = {
  setCourse({ commit, state }, payload) {
    const { index, name, value } = payload
    let course = state.course
    let c = course[index]
    c[name] = value
    commit('setHelp', { name: 'course', value: course })
  },
  addCourse({ commit, state }) {
    let course = state.course
    course.push({
      courseName: '',
      courseId: '',
      packageId: '',
      feeType: 0,
      coursePrice: '',
      buyTime: '',
      giveTime: '',
      schoolYear: '',
      schoolTermId: '',
      beginTime: '',
      endTime: ''
    })
    commit('setHelp', { name: 'course', value: course })
  },
  deleteCourse({ commit, state }, index) {
    let c = state.course
    if (!c.length || c.length <= 1) {
      return
    } else {
      c.splice(index, 1)
      commit('setHelp', { name: 'course', value: c })
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}