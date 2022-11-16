import { createApp, type ComponentPublicInstance, type ObjectDirective } from 'vue'
import Loading from './Loading.vue'
import { addClass } from '@/assets/js/dom'

type LoadingInstance =  ComponentPublicInstance<{}, {}, { title: string }, {}, {
  setTitle: (title: string) => void
}>

export const loadingDirective: ObjectDirective = {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance: LoadingInstance = app.mount(document.createElement('div')) as any
    el.instance = instance
    const title = binding.arg
    if(typeof title !== 'undefined') {
      instance.setTitle(title)
    }

    if(binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    if(binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}

export type DirectiveEl = HTMLElement & {instance: ComponentPublicInstance}

const relativeCls = 'g-relative'

function append (el: DirectiveEl) {
  const style = getComputedStyle(el)
  if(['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  el.appendChild(el.instance.$el)
}

function remove(el: DirectiveEl) {
  el.removeChild(el.instance.$el)
}
