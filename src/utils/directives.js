import Vue from 'vue'
const Regex = {}
export default () => {
    Vue.directive('yzn', {
        bind: (el, binding, vnode) => {
            let compare = binding.value.compare,
                type = binding.value.tp;
            Regex[type](el, compare);
        },
        update: (el, binding, vnode) => {
            let compare = binding.value.compare,
                type = binding.value.tp;
            Regex[type](el, compare);
        }
    })
    Vue.directive('h5blur', {
        bind: (el) => {
            el.onblur = () => {　　
                setTimeout(() => {　　　　
                    let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;　　　　
                    window.scrollTo(0, Math.max(scrollHeight, 0))　　
                }, 100)
            }
        }
    })
}