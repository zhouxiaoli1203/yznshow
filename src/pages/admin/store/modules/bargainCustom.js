const state = {
  
    productName: '', // 商品名称
    productDesc: '', // 商品描述
    originalPrice: '',// 原价
    floorPrice: '',// 活动价
    limitItems: 0,// 活动限制 0：不限制 1：[已签约学员只能开团不能参团/仅允许未签约的学员参与活动报名] 2：[已有潜客、已签约学员只能开团不能参团/仅允许已签约的学员参与活动报名]
    placesLimit: 1,// 活动名额限制 0：不限制 1：限制
    places: 40,// 活动名额限制数
    paySet: 2,// 活动支付设置 1：线下 2：拼团价 3：预付
    // prepaidAmount: '',// 活动预付金额
    totalNum: '',// 砍价次数
    // selfNum: '',// 自砍次数
    // helpNum: '' // 帮砍次数
  
}
const mutations = {
  setBargainCustom(state, {name, value}) {
    return state[name] = value
  },
  setPackages(state, payload) {
    Object.keys(payload).forEach(key=>{
      state[key] = payload[key]
    })
  }
}

const actions = {
  
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}