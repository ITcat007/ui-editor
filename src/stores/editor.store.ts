import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CommonUIEl, ButtonEl } from '../types/ui'
import { isButtonEl } from '../utils/typeGuards'

export const useEditorStore = defineStore('editor', () => {
  // State
  const layers = ref<CommonUIEl[]>([
    {
      id: '1',
      type: 'button',
      props: {
        text: 'Primary Button',
        borderRadius: 18,
        gradientFrom: '#00E1FD',
        gradientTo: '#FC007A',
        width: 155,
        height: 48
      }
    } as ButtonEl
  ])

  const selectedElId = ref<string | null>('1')

  // Getters
  const selectedEl = computed(() =>
    layers.value.find(el => el.id === selectedElId.value) || null
  )

  // Actions
  function selectEl(id: string) {
    selectedElId.value = id;
  }

  function updateButtonProps(
    id: string,
    props: Partial<ButtonEl['props']>
  ) {
    const el = layers.value.find(item => item.id === id)

    if (el && isButtonEl(el)){
      el.props = {
        ...el.props,
        ...props
      };
    }
  }

  function addButton() {
    const newEl: ButtonEl = {
      id: crypto.randomUUID(),
      type: 'button',
      props: {
        text: 'New Button',
        borderRadius: 18,
        gradientFrom: '#00E1FD',
        gradientTo: '#FC007A',
        width: 155,
        height: 48
      }
    }

    layers.value.push(newEl)
  }

  return {
    layers,
    selectedElId, 
    selectedEl,
    selectEl,
    updateButtonProps,
    addButton
  }
})