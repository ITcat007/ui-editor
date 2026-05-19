<template>
    <main class="w-full h-screen flex font-sans text-gray-300 bg-gray-800 overflow-hidden">
        <aside class="w-64">
            <h2 class="text-s font-semibold text-center tracking-wide uppercase text-gray-400 pt-2 mb-4">Elements</h2>
            <div>
                <button
                    v-for="(layer, index) in editor.layers"
                    :key="layer.id"
                    @click="editor.selectEl(layer.id)"
                    class="w-full mb-2 px-3 py-2 bg-slate-700 rounded"
                    :class="layer.id === editor.selectedElId? 'border-violet-400 bg-violet-500/20' : 'border-slate-700 hover:border-slate-500'"
                >
                <div class="flex items-center justify-between text-left">
                    <div>
                        <span class="capitalize mr-1">{{ layer.type }}</span>
                        <span>{{ index + 1 }}</span>
                    </div>
                    <div v-if="layer.id === editor.selectedElId" class="h-2 w-2 bg-emerald-500 rounded-full">
                    </div>
                </div>
                </button>
                <div class="mt-5 w-48 mx-auto">
                    <button 
                        @click="editor.addButton()"
                        class="px-3 py-2 w-full border border-dashed border-gray-500 hover:border-gray-300 transition rounded-2xl text-gray-300 tracking-wide uppercase"
                    >
                        Add a Button
                    </button>
                </div>
            </div>
        </aside>

        <!--CANVAS-->
        <section class="canvas-grid flex-1">
            <div class="flex flex-col justify-center items-center h-full">
                <div class="group">
                    <LResize v-if="editor.selectedEl && isButtonEl(editor.selectedEl)"
                        :initialWidth="editor.selectedEl.props.width"
                        :initialHeight="editor.selectedEl.props.height"
                        :cssUnit="'px'"
                        @boxUpdated="onResize"   
                        class="canvas-resizable"
                    >
                        <button                         
                            :style="buttonStyle"
                            class="px-3 w-full h-full font-medium rounded-lg overflow-hidden text-ellipsis whitespace-nowrap"
                            
                        >                      
                            {{ editor.selectedEl.props.text }}          
                        </button>
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
                <div class="space-y-4">
                    <div class="space-y-2">
                        <label class="text-sm text-gray-400">Element's Text</label>
                        <div v-if="editor.selectedEl && isButtonEl(editor.selectedEl)">
                            <input
                                v-model="buttonText"
                                type="text"
                                class="w-full bg-gray-800 mt-1 px-3 py-2 border border-gray-700 rounded text-sm outline-none focus:border-cyan-600 transition"
                            >
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm text-gray-400">Rounding (px)</label>
                        <input type="range" class="w-full accent-blue-500" v-model="borderRadius">                        
                    </div>
                    <div class="space-y-2">
                        <label class="text-sm text-gray-400">Gradient's Color 1</label>
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
                        <label class="text-sm text-gray-400">Gradient's Color 2</label>
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
            </div>
        </aside>
    </main>
</template>

<script setup lang="ts">
    import { useEditorStore } from '../stores/editor.store'
    import {LResize} from "vue3-resizable"
    import "vue3-resizable/dist/index.css"
    import { computed } from 'vue'
    import { isButtonEl } from '../utils/typeGuards'
    import type {SizeState} from '../types/resizable'

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

    const borderRadius = computed({
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
</script>

<style scoped>
    .canvas-resizable{
        position: relative !important;
        left: 0 !important;
        top:0 !important;
    }    
</style>
