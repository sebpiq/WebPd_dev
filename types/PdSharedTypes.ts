declare module PdSharedTypes {
    type NodeArgument = string | number

    type ControlValue = Array<NodeArgument>

    type SignalValue = number

    type NodeType = string

    type PortletType = 'signal' | 'control'
}