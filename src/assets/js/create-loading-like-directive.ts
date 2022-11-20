import { createApp, type ComponentPublicInstance, type ObjectDirective } from 'vue'
import { addClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

export type DirectiveEl = HTMLElement & {instance: ComponentPublicInstance}

export default function createLoadingLikeDirective(Comp: any): ObjectDirective {

  const name: string = Comp.name

  function append (el: any) {
    const style = getComputedStyle(el)
    if(['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }
  
  function remove(el: any) {
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div')) as any
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance

      const title = binding.arg
      if(typeof title !== 'undefined') {
        instance.setTitle(title)
      }
  
      if(binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if(binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}
