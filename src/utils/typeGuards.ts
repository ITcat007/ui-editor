import type { CommonUIEl, ButtonEl, ContainerEl } from '../types/ui'

export function isButtonEl(el: CommonUIEl): el is ButtonEl {
    return el.type === 'button'
}

export function isContainerEl(el: CommonUIEl): el is ContainerEl {
    return el.type === 'container'
}