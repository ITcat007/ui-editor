import type { CommonUIEl, ButtonEl } from '../types/ui'

export function isButtonEl(el: CommonUIEl): el is ButtonEl {
    return el.type === 'button'
}