const state = {
  packages: [{
    productName: '',
    productDesc: '',
    originalPrice: '',
    floorPrice: '',
    limitItems: 0,
    placesLimit: 1,
    places: 40,
    oldPlaces: '',

    paySet: 2,
    prepaidAmount: '',

    //more: true,   // 是否展开
  }],
  // limitNum: '',
  // signUpLimit: true
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
        floorPrice: i.floorPrice,
        limitItems: i.limitItems,
        placesLimit: i.placesLimit,
        places: i.places,
        oldPlaces: i.places,
        paySet: 2,
        prepaidAmount: i.prepaidAmount,
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
      floorPrice: '',
      limitItems: 0,
      placesLimit: 1,
      places: 40,
      oldPlaces: '',
      paySet: 2,
      prepaidAmount: '',
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
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}