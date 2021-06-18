const state = {
  activityId: '',
  activeType: '',
  activeContent: '',
  info: '', // 注册必填项
  code: '',

  selectedCourse: [],
  selectedStu: {},
  stuList: [],
  limitNum: '',
  packageLen: '', // 课包数量    判断抢购是否是多课包，决定是否进入选课程页面

  activeJoin: {
    nickname: "",
    headimgurl: "",
    phone: "",
    openid: '',
    isJoinSelf: 0,
    phoneNum: ''
  },
  indexPop: {
    show: false,
    btn: '我知道了',
    type: 1,
    title: 'ads',
    desc: 'asdgsadgasd'
  },
  shopPhone: ''
}
const mutations = {
  setActivityId(state, payload) {
    state.activityId = payload
  },
  setActiveType(state, payload) {
    state.activeType = payload
  },
  setActiveContent(state, payload) {
    state.activeContent = payload
  },
  setPackageLen (state, payload) {
    state.packageLen = payload
  },
  addSelectedCourse(state, payload) {
    if (state.activeType == 3) {
      state.selectedCourse = [payload]
    } else {
      let c = state.selectedCourse
      c.push(payload)
      state.selectedCourse = c
    }
  },
  removeSelectedCourse(state, payload) {
    let c = state.selectedCourse
    let arr = []
    c.map(i => {
      if (i.contentId != payload) {
        arr.push(i)
      }
    })
    state.selectedCourse = arr
  },
  setPhone (state, payload) {
    state.shopPhone = payload
  },
  setInfo(state, payload) {
    state.info = payload
  },
  setStuList(state, payload) {
    state.stuList = payload
  },
  setSelectedStu(state, payload) {
    state.selectedStu = payload
  },
  clearSelectedStu(state) {
    state.selectedStu = {}
  },
  cleanSelectedCourse(state) {
    state.selectedCourse = []
  },
  setActiveJoin(state, payload) {
    state.activeJoin = payload
  },
  setIndexPop(state, payload) {
    state.indexPop = {
      show: payload.show || false,
      btn: payload.btn || '',
      type: payload.type || '1',
      title: payload.title|| '',
      desc: payload.desc || '',
    }
  },
  registerStu (state, payload) {
    let stuList = state.stuList
    stuList.push({
      name: payload.name ,
      birthday: payload.birthday ,
      sex:payload.sex ,
      grade: payload.grade,
      age: payload.age,
      schoolName: payload.schoolName ,
      potentialCustomerParentPhone: payload.potentialCustomerParentPhone,
    })
  }
}
const actions = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}