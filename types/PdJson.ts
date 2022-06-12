/*
 * Copyright (c) 2012-2020 Sébastien Piquemal <sebpiq@gmail.com>
 *
 * BSD Simplified License.
 * For information on usage and redistribution, and for a DISCLAIMER OF ALL
 * WARRANTIES, see the file, "LICENSE.txt," in this distribution.
 *
 * See https://github.com/sebpiq/WebPd_pd-parser for documentation
 *
 */

declare module PdJson {
    // In Pd some objects use a global namespace shared across all patches.
    // This is the case for example of arrays.
    type ObjectGlobalId = string

    // Other objects use a local namespace. In this case, it is therefore possible
    // for 2 different objects in distinct patches to have the same name without
    // interfering. This is the case for example of subpatches.
    type ObjectLocalId = string

    type ObjectArg = string | number

    type ObjectArgs = Array<ObjectArg>

    type PortletId = number

    type PortletType = 'control' | 'signal' | 'mixed'

    interface ConnectionEndpoint {
        nodeId: ObjectLocalId
        portletId: PortletId
    }

    interface Connection {
        source: ConnectionEndpoint
        sink: ConnectionEndpoint
    }

    interface ObjectLayout {
        x?: number
        y?: number
        width?: number
        height?: number
    }

    interface PdObject {
        args: ObjectArgs
        layout?: ObjectLayout
    }

    interface PdArray extends PdObject {
        id: ObjectGlobalId
        data: Array<number>
    }

    interface PatchLayout extends ObjectLayout {
        openOnLoad?: boolean
    }

    interface Patch extends PdObject {
        id: ObjectGlobalId
        nodes: { [localId: string]: Node }
        connections: Array<Connection>
        inlets: Array<ObjectLocalId>
        outlets: Array<ObjectLocalId>
        layout?: PatchLayout
    }

    interface GenericNode extends PdObject {
        id: ObjectLocalId
        type: PdSharedTypes.NodeType
        // In case the node is only the "outer shell" for a subpatch or an array,
        // this `refId` allows to recover said subpatch or array in the global Pd object.
        refId?: ObjectGlobalId
    }

    type ControlNode =
        | AtomNode
        | BangNode
        | ToggleNode
        | NumberBoxNode
        | SliderNode
        | RadioNode
        | VuNode
        | CnvNode
    type Node = ControlNode | GenericNode

    interface Pd {
        patches: { [globalId: string]: Patch }
        arrays: { [globalId: string]: PdArray }
    }

    // ------------------- Specific types for controls ------------------- //

    interface AtomLayout extends ObjectLayout {
        label?: string
        labelPos?: number
    }

    interface AtomNode extends GenericNode {
        type: 'floatatom' | 'symbolatom'
        layout?: AtomLayout
    }

    interface BangLayout extends ObjectLayout {
        size?: number
        hold?: number
        interrupt?: number
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        fgColor?: string
        labelColor?: string
    }

    interface BangNode extends GenericNode {
        type: 'bng'
        layout?: BangLayout
    }

    interface ToggleLayout extends ObjectLayout {
        size?: number
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        fgColor?: string
        labelColor?: string
    }

    interface ToggleNode extends GenericNode {
        type: 'tgl'
        layout?: ToggleLayout
    }

    interface NumberBoxLayout extends ObjectLayout {
        size?: number
        log?: number
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        fgColor?: string
        labelColor?: string
        logHeight?: string
    }

    interface NumberBoxNode extends GenericNode {
        type: 'nbx'
        layout?: NumberBoxLayout
    }

    interface SliderLayout extends ObjectLayout {
        log?: number
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        fgColor?: string
        labelColor?: string
        steadyOnClick?: string
    }

    interface SliderNode extends GenericNode {
        type: 'vsl' | 'hsl'
        layout?: SliderLayout
    }

    interface RadioLayout extends ObjectLayout {
        size?: number
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        fgColor?: string
        labelColor?: string
    }

    interface RadioNode extends GenericNode {
        type: 'vradio' | 'hradio'
        layout?: RadioLayout
    }

    interface VuLayout extends ObjectLayout {
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        labelColor?: string
        log?: number
    }

    interface VuNode extends GenericNode {
        type: 'vu'
        layout?: VuLayout
    }

    interface CnvLayout extends ObjectLayout {
        size?: number
        label?: string
        labelX?: number
        labelY?: number
        labelFont?: string
        labelFontSize?: number
        bgColor?: string
        labelColor?: string
    }

    interface CnvNode extends GenericNode {
        type: 'cnv'
        layout?: CnvLayout
    }
}
