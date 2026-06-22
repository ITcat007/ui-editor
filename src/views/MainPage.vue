<template>
    <main class="w-full h-screen flex font-sans text-gray-300 bg-gray-800 overflow-hidden">
        <aside class="w-64">
                <div class="pt-3 mb-2 flex justify-evenly">
                    <button 
                        @click="editor.addButton()"
                        class="px-3 py-2 border border-dashed border-gray-500 hover:border-gray-300 transition rounded-2xl text-sm text-gray-300 tracking-wide"
                    >
                        + Button
                    </button>
                    <button 
                        @click="editor.addContainer()"
                        class="px-3 py-2 border border-dashed border-gray-500 hover:border-gray-300 transition rounded-2xl text-sm text-gray-300 tracking-wide"
                    >
                        + Container
                    </button>
                </div>            
            <h2 class="text-s font-semibold text-center tracking-wide uppercase text-gray-400 pt-2 mb-2">Elements</h2>
            <div>
                <button
                    v-for="(element, index) in editor.elements"
                    :key="element.id"
                    @click="editor.selectEl(element.id)"
                    class="w-full mb-2 px-3 py-2 bg-slate-700 rounded"
                    :class="{'bg-violet-500/20': element.id === editor.selectedElId}"
                >
                <div class="flex items-center justify-between text-left">
                    <div>
                        {{ element.name }}
                    </div>
                    <div v-if="element.id === editor.selectedElId" class="h-2 w-2 bg-emerald-500 rounded-full">
                    </div>
                </div>
                </button>               
            </div>
        </aside>

        <!--CANVAS-->
        <section class="canvas-grid flex-1">
            <div class="flex flex-col justify-center items-center h-full">
                <div class="group">
                    <LResize v-if="editor.selectedEl && (isButtonEl(editor.selectedEl) || isContainerEl(editor.selectedEl))"
                        :key="`${editor.selectedEl.id}`"
                        :initialWidth="editor.selectedEl.props.width"
                        :initialHeight="editor.selectedEl.props.height"
                        :cssUnit="'px'"
                        @boxUpdated="onResize"   
                        class="canvas-resizable"
                    >
                        <button 
                            v-if="isButtonEl(editor.selectedEl)"                        
                            :style="buttonStyle"
                            class="px-3 w-full h-full font-medium rounded-lg overflow-hidden text-ellipsis whitespace-nowrap"
                            
                        >                      
                            {{ editor.selectedEl.props.text }}          
                        </button>
                        <div
                            v-else="isContainerEl(editor.selectedEl)"
                            :style="containerStyle"
                        >
                            <div class="test-pd" style="width:30%; height:30%; background-color:palevioletred"></div>
                            <div class="test-pd2" style="width:30%; height:30%; background-color:green"></div>
                        </div>
                    </LResize>
                    <div v-if="editor.selectedEl && isButtonEl(editor.selectedEl)" class="relative left-1/2 -translate-x-1/2 -bottom-2 w-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none select-none">
                        <div class="text-[11px] px-1 py-1 bg-gray-800 text-gray-400 text-center border border-gray-700 shadow-lg">
                            {{ sizeTip }}
                        </div>
                    </div>
                </div>
            </div>            
        </section>

        <aside class="w-xs bg-gray-800">
            <div class="w-64 m-auto">
                <h2 class="text-s font-semibold text-center tracking-wide uppercase text-gray-400 pt-2 mb-4">Settings</h2>
                <div 
                    v-if="editor.selectedEl && isButtonEl(editor.selectedEl)"
                    class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-[15px] text-gray-400">Element's Text</label>
                        <div v-if="editor.selectedEl && isButtonEl(editor.selectedEl)">
                            <input
                                v-model="buttonText"
                                type="text"
                                class="w-full bg-gray-800 mt-1 px-3 py-2 border border-gray-700 rounded text-sm outline-none focus:border-cyan-600 transition"
                            >
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="inline-block mb-1 text-[15px] text-gray-400">Rounding (px)</label>
                        <input type="range"
                            class="w-full accent-blue-500"
                            v-model.number="buttonBorderRadius"
                            min="0"
                            max="32"
                        >                        
                    </div>
                    <div class="space-y-2">
                        <label class="text-[15px] text-gray-400">Gradient's Color 1</label>
                        <div class="flex items-center gap-3 mt-1">
                            <input 
                                type="color" 
                                v-model="gradientFrom"
                                class="w-9 h-9 border border-gray-700 rounded-full"
                            >
                            <input 
                                type="text"   
                                v-model="gradientFrom"                             
                                class="flex-1 px-3 py-2 bg-gray-800 text-sm border border-gray-700 rounded outline-none focus:border-cyan-600 transition"
                            >
                        </div>
                    </div>
                    <div>
                        <label class="text-[15px] text-gray-400">Gradient's Color 2</label>
                        <div class="flex items-center gap-3 mt-1">
                            <input 
                                type="color"
                                v-model="gradientTo"
                                class="w-9 h-9 border border-gray-700 rounded-full"
                            >
                            <input 
                                type="text"
                                v-model="gradientTo"
                                class="flex-1 px-3 py-2 bg-gray-800 text-sm border border-gray-700 rounded outline-none focus:border-cyan-600 transition"
                            >
                        </div>
                    </div>
                </div>

                <div 
                    v-if="editor.selectedEl && isContainerEl(editor.selectedEl)"
                    class="space-y-4"
                >
                    <div class="space-y-2">
                        <label class="inline-block text-[15px] text-gray-400 mb-1">Rounding (px)</label>
                        <input 
                            type="range" 
                            class="w-full accent-blue-500" 
                            v-model.number="containerBorderRadius"
                            min="0"
                            max="80"
                        >                        
                    </div>

                    <div class="space-y-2">
                        <label class="text-[15px] text-gray-400">Background Color</label>
                        <div class="flex items-center gap-3 mt-1">
                            <input 
                                type="color" 
                                v-model="containerBackgroundColor"
                                class="w-9 h-9 border border-gray-700 rounded-full"
                            >
                            <input 
                                type="text"   
                                v-model="containerBackgroundColor"                             
                                class="flex-1 px-3 py-2 bg-gray-800 text-sm border border-gray-700 rounded outline-none focus:border-cyan-600 transition"
                            >
                        </div>
                    </div>

                   <div class="space-y-2">
                        <label class="block text-[15px] text-gray-400 mb-1">Padding</label>

                        <label class="flex gap-2 text-sm">
                            <input
                                type="checkbox"
                                v-model="customizePaddingSides"
                            >
                            Customize sides
                        </label>

                        <!--Customizing paddings-->
                        <div v-if="customizePaddingSides"
                            class="grid grid-cols-3 grid-rows-3 mx-auto text-sm"
                        >
                        <label class="col-start-2 col-end-3 flex flex-col items-center">
                            Top
                            <input 
                                type="number" 
                                v-model.number="paddingTop"
                                min="0"
                                max="300"
                                class="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700 outline-none focus:border-cyan-600 transition"
                            >
                        </label>
                        <label class="row-start-2 col-start-3 flex flex-col items-center">
                            Right
                            <input 
                                type="number" 
                                v-model.number="paddingRight"
                                min="0"
                                max="300"
                                class="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700 outline-none focus:border-cyan-600 transition"
                            >
                        </label>
                        <label class="row-start-3 col-start-2 flex flex-col items-center">
                            Bottom
                            <input 
                                type="number" 
                                v-model.number="paddingBottom"
                                min="0"
                                max="300"
                                class="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700 outline-none focus:border-cyan-600 transition"
                            >
                        </label>
                        <label class="row-start-2 flex flex-col items-center">
                            Left
                            <input 
                                type="number" 
                                v-model.number="paddingLeft"
                                min="0"
                                max="300"
                                class="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700 outline-none focus:border-cyan-600 transition row-start-2"
                            >
                        </label>
                        </div>

                        <div v-else>
                            <input
                                type="number"
                                v-model.number="uniformPadding"
                                min="0"
                                max="300"
                                class="px-3 py-2 bg-gray-800 rounded text-sm border border-gray-700 outline-none focus:border-cyan-600 transition"
                            />
                        </div>
                    </div>  
                    <div class="space-y-2">
                         <label class="inline-block text-[15px] text-gray-400 mb-2">Flex Direction</label>
                         <div class="flex gap-4 text-sm">
                            <button 
                                :class="['px-3 border rounded transition',
                                        containerFlexDirection === 'row'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerFlexDirection = 'row'"
                            >
                                Row
                            </button>
                            <button
                                :class="['px-3 border rounded transition',
                                        containerFlexDirection === 'column'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerFlexDirection = 'column'"
                            >
                                Column
                            </button>
                         </div>
                    </div>
                    <div class="space-y-2">
                         <label class="inline-block text-[15px] text-gray-400 mb-2">Justify Content</label>
                         <div class="flex flex-wrap gap-3 text-sm">
                            <button 
                                :class="['px-3 border rounded transition',
                                        containerJustifyContent === 'flex-start'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerJustifyContent = 'flex-start'"
                            >
                                Start
                            </button>
                            <button
                                :class="['px-3 border rounded transition',
                                        containerJustifyContent === 'flex-end'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerJustifyContent = 'flex-end'"
                            >
                                End
                            </button>
                            <button
                                :class="['px-3 border rounded transition',
                                        containerJustifyContent === 'center'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerJustifyContent = 'center'"
                            >
                                Center
                            </button>
                            <button
                                :class="['px-3 border rounded transition',
                                        containerJustifyContent === 'space-between'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerJustifyContent = 'space-between'"
                            >
                                Space Between
                            </button>
                            <button
                                :class="['px-3 border rounded transition',
                                        containerJustifyContent === 'space-around'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerJustifyContent = 'space-around'"
                            >
                                Space Around
                            </button>
                            <button
                                :class="['px-3 border rounded transition',
                                        containerJustifyContent === 'space-evenly'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerJustifyContent = 'space-evenly'"
                            >
                                Space Evenly
                            </button>
                         </div>
                    </div>
                    <div class="space-y-2">
                         <label class="inline-block text-[15px] text-gray-400 mb-2">Align Items</label>
                         <div class="flex flex-wrap gap-3 text-sm">
                            <button 
                                :class="['px-3 border rounded transition',
                                        containerAlignItems === 'flex-start'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerAlignItems = 'flex-start'"
                            >
                                Start
                            </button>
                            <button 
                                :class="['px-3 border rounded transition',
                                        containerAlignItems === 'flex-end'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerAlignItems = 'flex-end'"
                            >
                                End
                            </button>
                            <button 
                                :class="['px-3 border rounded transition',
                                        containerAlignItems === 'center'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerAlignItems = 'center'"
                            >
                                Center
                            </button>
                            <button 
                                :class="['px-3 border rounded transition',
                                        containerAlignItems === 'stretch'? 'border-cyan-600' : 'border-gray-700'
                                ]"
                                @click="containerAlignItems = 'stretch'"
                            >
                                Stretch
                            </button>
                         </div>     
                    </div>   
                    <div class="space-y-2">
                        <label class="inline-block mb-1 text-[15px] text-gray-400">Gap</label>
                        <input 
                            type="range" 
                            class="w-full accent-blue-500" 
                            v-model.number="containerGap"
                            min="0"
                            max="100"
                        >     
                    </div>           
                </div>
            </div>
        </aside>
    </main>
</template>

<script setup lang="ts">
    import { useEditorStore } from '../stores/editor.store'
    import {LResize} from "vue3-resizable"
    import "vue3-resizable/dist/index.css"
    import { computed } from 'vue'
    import { ref } from 'vue'
    import { isButtonEl, isContainerEl } from '../utils/typeGuards'
    import type {SizeState} from '../types/resizable'
    import type { PaddingSide, FlexDir, JustifyContent, AlignItems } from '@/types/ui'

    const editor = useEditorStore()

    const buttonStyle = computed (() => {
        const editingEl = editor.selectedEl;
        if (editingEl && isButtonEl(editingEl)) {
            return {          
                borderRadius: `${editingEl.props.borderRadius}px`,
                background: `linear-gradient(90deg, ${editingEl.props.gradientFrom}, ${editingEl.props.gradientTo})`
            }
        }
    })

    const sizeTip = computed (() => {
        const editingEl = editor.selectedEl;
        if (editingEl && isButtonEl(editingEl)) {
            return `${editingEl.props.width} x ${editingEl.props.height} px`
        }
    })

    const onResize = (box: SizeState) => {  
        const editingEl = editor.selectedEl;  
        if (editingEl && isButtonEl(editingEl)) {
            editor.updateButtonProps(editingEl.id, {
                width: Math.round(box.width),
                height: Math.round(box.height)               
            })
        } else if (editingEl && isContainerEl(editingEl)) {
            editor.updateContainerProps(editingEl.id, {
                width: Math.round(box.width),
                height: Math.round(box.height)
            })
        }
    }

    const buttonText = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isButtonEl(editingEl)) {
                return editingEl.props.text
            }
        },
        set(value: string) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isButtonEl(editingEl)) {
                editor.updateButtonProps(editingEl.id, {
                    text: value
                })
            }
        }
    })

    const buttonBorderRadius = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isButtonEl(editingEl)) {
                return editingEl.props.borderRadius
            }
        },
        set(value: number) {
            const editingEl = editor.selectedEl;  
            if (editingEl && isButtonEl(editingEl)) {
                editor.updateButtonProps(editingEl.id, {
                    borderRadius: value
                })
            }
        }
    })    

    const gradientFrom = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isButtonEl(editingEl)) {
                return editingEl.props.gradientFrom
            }
        },
        set(value: string) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isButtonEl(editingEl)) {
                editor.updateButtonProps(editingEl.id, {
                    gradientFrom: value
                })
            }
        }
    })

    const gradientTo = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isButtonEl(editingEl)) {
                return editingEl.props.gradientTo
            }
        },
        set(value: string) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isButtonEl(editingEl)) {
                editor.updateButtonProps(editingEl.id, {
                    gradientTo: value
                })
            }
        }
    })

    const containerStyle = computed (() => {
        const editingEl = editor.selectedEl;
        if (editingEl && isContainerEl(editingEl)) {
            return {     
                display: 'flex',     
                borderRadius: `${editingEl.props.borderRadius}px`,
                padding: `${editingEl.props.padding.top}px ${editingEl.props.padding.right}px ${editingEl.props.padding.bottom}px ${editingEl.props.padding.left}px`,
                background: editingEl.props.background,
                width: `${editingEl.props.width}px`,
                height: `${editingEl.props.height}px`,
                flexDirection: editingEl.props.flexDirection,
                justifyContent: editingEl.props.justifyContent,
                alignItems: editingEl.props.alignItems,
                gap: `${editingEl.props.gap}px`
            }
        }
    })

    const containerBorderRadius = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                return editingEl.props.borderRadius
            }
        },
        set(value: number) {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                editor.updateContainerProps(editingEl.id, {
                    borderRadius: value
                })
            }
        }
    }) 

    const containerBackgroundColor = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                return editingEl.props.background
            }
        },
        set(value: string) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isContainerEl(editingEl)) {
                editor.updateContainerProps(editingEl.id, {
                    background: value
                })
            }
        }
    }) 

    
    function setPadding(side: PaddingSide) {
        return computed({
            get() {
                const editingEl = editor.selectedEl;
                if (editingEl && isContainerEl(editingEl)) {
                    return editingEl.props.padding[side]
                }
                return 0
            },
            set(value: number) {
                const editingEl = editor.selectedEl;
                if (editingEl && isContainerEl(editingEl)) {
                    editor.updateContainerProps(editingEl.id, {
                        padding: {
                            ...editingEl.props.padding,
                            [side] : value
                        }
                     })
                }
            }
        })
    }

    const paddingTop = setPadding('top')
    const paddingRight = setPadding('right')
    const paddingBottom = setPadding('bottom')
    const paddingLeft = setPadding('left')

    const uniformPadding = computed({
        get() {
            const editingEl = editor.selectedEl;
                if (editingEl && isContainerEl(editingEl)) {
                    return editingEl.props.padding.top
                }
                return 0
        },
        set(value: number) {
            const editingEl = editor.selectedEl;
            if (editingEl && isContainerEl(editingEl)) {
                    editor.updateContainerProps(editingEl.id, {
                        padding: {
                            top: value,
                            right: value,
                            bottom: value,
                            left: value
                        }
                     })
            }
        }
    })
    const customizePaddingSides = ref(false)

    const containerFlexDirection = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                return editingEl.props.flexDirection
            }
            return 'column'
        },
        set(value: FlexDir) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isContainerEl(editingEl)) {
                editor.updateContainerProps(editingEl.id, {
                    flexDirection: value
                })
            }
        }
    }) 

    const containerJustifyContent = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                return editingEl.props.justifyContent
            }
            return 'center'
        },
        set(value: JustifyContent) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isContainerEl(editingEl)) {
                editor.updateContainerProps(editingEl.id, {
                    justifyContent: value
                })
            }
        }
    }) 

    const containerAlignItems = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                return editingEl.props.alignItems
            }
            return 'center'
        },
        set(value: AlignItems) {
            const editingEl = editor.selectedEl;  
             if (editingEl && isContainerEl(editingEl)) {
                editor.updateContainerProps(editingEl.id, {
                    alignItems: value
                })
            }
        }
    }) 

    const containerGap = computed({
        get() {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                return editingEl.props.gap
            }
            return 0
        },
        set(value: number) {
            const editingEl = editor.selectedEl;  
            if (editingEl && isContainerEl(editingEl)) {
                editor.updateContainerProps(editingEl.id, {
                    gap: value
                })
            }
        }
    }) 
</script>

<style scoped>
    .canvas-resizable{
        position: relative !important;
        left: 0 !important;
        top:0 !important;
    }    
</style>
