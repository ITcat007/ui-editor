export type UIElType = 'button' | 'container' | 'text'

export interface CommonUIEl {
    id: string
    type: UIElType
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
