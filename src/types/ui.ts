export type UIElType = 'button' | 'container' | 'text'

export interface CommonUIEl {
    id: string
    type: UIElType
    name: string
}

//Button
export interface ButtonProps {
    text: string
    borderRadius: number
    gradientFrom: string
    gradientTo: string
    width: number
    height: number
}

export interface ButtonEl extends CommonUIEl {
    type: 'button'
    props: ButtonProps
}

// Container
export type FlexDir = 'row' | 'column'

export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'

export type AlignItems =  'flex-start' | 'flex-end' | 'center' | 'stretch'

export interface ContainerProps {
    borderRadius: number
    padding: Padding
    background: string
    width: number
    height: number
    flexDirection: FlexDir
    justifyContent: JustifyContent
    alignItems: AlignItems
    gap: number
}
 export interface Padding {
    top: number
    right: number
    bottom: number
    left: number
}

export type PaddingSide = 'top' | 'right' | 'bottom' | 'left'

export interface ContainerEl extends CommonUIEl {
    type: 'container'
    props: ContainerProps
}

//Text
export interface TextProps {
    text: string
    fontSize: number
    color: string
}

export interface TextEl extends CommonUIEl {
    type: 'text'
    props: TextProps
}

export type UIEl = ButtonEl | ContainerEl | TextEl
