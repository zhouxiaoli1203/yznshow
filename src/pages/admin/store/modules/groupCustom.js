const state = {
  packages: [{
    productName: '',
    productDesc: '',
    originalPrice: '',
    //floorPrice: '',
    limitItems: 0,
    placesLimit: 1,
    places: 40,

    paySet: 2,
    prepaidAmount: '',
    //virtualGroup: 0, // 虚拟成团 0：否 1：是
    showContentRuleList: [{
      number: '',
      price: ''
    }]
  }]
}

const mutations = {
  setPackages(state, packages) {
    return state.packages = [...packages]
  },
}

const actions = {
  initPackage({commit, state}, payload) {
    let arr = []
    for (let i of payload) {
      let p = {
        productName: i.productName,
        productDesc: i.productDesc,
        originalPrice: i.originalPrice,
        limitItems: i.limitItems,
        placesLimit: i.placesLimit,
        places: i.places,
        prepaidAmount: i.prepaidAmount,
        paySet: i.paySet,
        //virtualGroup: i.virtualGroup,
        showContentRuleList: []
      }
      if (i.showContentRuleList && i.showContentRuleList.length) {
        for (let k of i.showContentRuleList) {
          let obj = {
            number: k.number,
            price: k.price
          }

          p.showContentRuleList.push(obj)
        }
      }
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
  addPackage({ commit, state, rootGetters }) {
    let p = [...state.packages]
    p.push({
      productName: '',
      productDesc: '',
      originalPrice: '',
      limitItems: 0,
      placesLimit: 1,
      places: 40,
      paySet: 2,
      prepaidAmount: '',
      //virtualGroup: 0,
      showContentRuleList: [{
        number: '',
        price: ''
      }]
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
  addRuleByIndex({ commit, state }, index) {
    let p = state.packages
    let rule = p[index].showContentRuleList
    rule.push({
      number: '',
      price: ''
    })
    commit('setPackages', p)
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

  // initPackage({ commit, state }, payload) {
  //   let arr = []
  //   for (let i of payload) {
  //     let p = {
  //       productName: i.productName !== undefined ? i.productName: '',
  //       productDesc: i.productDesc !== undefined ? i.productDesc: '',
  //       originalPrice: i.originalPrice !== undefined ? i.originalPrice: '',
  //       limitItems: i.limitItems !== undefined ? i.limitItems: '',
  //       placesLimit: i.placesLimit !== undefined ? i.placesLimit: '',
  //       places: i.places !== undefined ? i.places: '',
  //       paySet: i.paySet !== undefined ? i.paySet: '',
  //       prepaidAmount: i.prepaidAmount !== undefined ? i.prepaidAmount: '',
  //       virtualGroup: i.virtualGroup !== undefined ? i.virtualGroup: '', 
  //       showContentRuleList: i.showContentRuleList
  //     }
  //     let c = []
  //     if (i.showContentRuleList && i.showContentRuleList.length) {
  //       p['showContentRuleList'] = 
  //     }
  //     p.course = c
  //     arr.push(p)
  //   }
  //   commit('setPackages', arr)
  // }

  // setPackagesItemByName({ commit, state }, payload) {
  //   const { index, name, value } = payload
  //   let p = state.packages
  //   let obj = p[index]
  //   obj[name] = value
  //   commit('setPackages', p)
  // },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}