import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CommonUIEl, UIElType, ButtonEl, ContainerEl} from '../types/ui'
import { isButtonEl, isContainerEl } from '../utils/typeGuards'

export const useEditorStore = defineStore('editor', () => {
  // State
  const elements = ref<CommonUIEl[]>([
    {
      id: '1',
      type: 'button',
      name: 'Button 1',
      props: {
        text: 'Button 1',
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
    elements.value.find(el => el.id === selectedElId.value) || null
  )

  // Actions
  function selectEl(id: string) {
    selectedElId.value = id;
  }

  function updateButtonProps(
    id: string,
    props: Partial<ButtonEl['props']>
  ) {
    const el = elements.value.find(item => item.id === id)

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
      name: showElementName('button'),
      props: {
        text: 'New Button',
        borderRadius: 18,
        gradientFrom: '#00E1FD',
        gradientTo: '#FC007A',
        width: 155,
        height: 48
      }
    }

    elements.value.push(newEl)
    selectedElId.value = newEl.id
  }

  function addContainer() {
    const newEl: ContainerEl = {
      id: crypto.randomUUID(),
      type: 'container',
      name: showElementName('container'),
      props: {
        borderRadius: 0,
        padding: {
          top: 15,
          right: 15,
          bottom: 15,
          left: 15
        },
        background: '#4a5f7c',
        width: 200,
        height: 350,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
      }
    }
    console.log(newEl)
    elements.value.push(newEl)
    selectedElId.value = newEl.id
  }

  function updateContainerProps(
    id: string,
    props: Partial<ContainerEl['props']>
  ) {
    const el = elements.value.find(item => item.id === id)

    if (el && isContainerEl(el)){
      el.props = {
        ...el.props,
        ...props
      };
    }
  }  

  function showElementName(type: UIElType) {
    const count = elements.value.filter(element => element.type === type).length + 1

    switch(type) {
      case "button":
        return `Button ${count}`
      case "container":
        return `Container ${count}`        
      case "text":
        return `Text ${count}`        
      default:
        return "Element"     
    }
  }

  return {
    elements,
    selectedElId, 
    selectedEl,
    selectEl,
    updateButtonProps,
    updateContainerProps,
    addButton,
    addContainer
  }
})