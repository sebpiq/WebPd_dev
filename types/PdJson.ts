declare module PdJson {

    type ObjectGlobalId = string;
    type ObjectLocalId = string;
    type ObjectArgument = string | number;
    
    interface ObjectLayout {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    }
    
    interface PdObject {
        args: Array<ObjectArgument>;
        layout?: ObjectLayout;
    }

    interface PdArray extends PdObject {
        id: ObjectGlobalId;
        data: Array<number>;
    }

    interface PatchLayout extends ObjectLayout {
        openOnLoad?: boolean;
    }

    interface Patch extends PdObject {
        id: ObjectGlobalId;
        nodes: { [localId: string]: Node };
        connections: Array<Connection>;
        inlets: Array<ObjectLocalId>;
        outlets: Array<ObjectLocalId>;
        layout?: PatchLayout;
    }

    interface GenericNode extends PdObject {
        id: ObjectLocalId;
        type: NodeType;
        // In case the node is only the "outer shell" for a subpatch or an array,
        // this `refId` allows to recover said subpatch or array in the global Pd object.
        refId?: ObjectGlobalId;
    }

    type ControlNode = AtomNode | BangNode | ToggleNode | NumberBoxNode | SliderNode | RadioNode | VuNode | CnvNode;
    type Node = ControlNode | GenericNode;

    type PortletId = number;
    interface PortletAddress {
        id: ObjectLocalId
        portlet: PortletId
    }

    interface Connection {
        source: PortletAddress;
        sink: PortletAddress;
    }

    interface Pd {
        patches: { [globalId: string]: Patch };
        arrays: { [globalId: string]: PdArray }
    }


    // ------------------- Node types registry ------------------- // 

    type NodeType = string;
    enum PortletType {
        SIGNAL = 'signal',
        CONTROL = 'control',
    }

    type PortletTypeGetter = (portlet: PortletId) => PortletType

    interface NodeTemplate {
        getInletType: PortletTypeGetter,
        getOutletType: PortletTypeGetter,
        isSink: () => boolean,
    }

    interface Registry {
        [nodeType: string]: NodeTemplate
    }

    // ------------------- Specific types for controls ------------------- //

    interface AtomLayout extends ObjectLayout {
        label?: string;
        labelPos?: number;
    }

    interface AtomNode extends GenericNode {
        type: 'floatatom' | 'symbolatom';
        layout?: AtomLayout;
    }

    interface BangLayout extends ObjectLayout {
        size?: number;
        hold?: number;
        interrupt?: number;
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        fgColor?: string;
        labelColor?: string;
    }

    interface BangNode extends GenericNode {
        type: 'bng';
        layout?: BangLayout;
    }

    interface ToggleLayout extends ObjectLayout {
        size?: number;
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        fgColor?: string;
        labelColor?: string;
    }

    interface ToggleNode extends GenericNode {
        type: 'tgl';
        layout?: ToggleLayout;
    }

    interface NumberBoxLayout extends ObjectLayout {
        size?: number;
        log?: number;
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        fgColor?: string;
        labelColor?: string;
        logHeight?: string;
    }

    interface NumberBoxNode extends GenericNode {
        type: 'nbx';
        layout?: NumberBoxLayout;
    }

    interface SliderLayout extends ObjectLayout {
        log?: number;
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        fgColor?: string;
        labelColor?: string;
        steadyOnClick?: string;
    }

    interface SliderNode extends GenericNode {
        type: 'vsl' | 'hsl';
        layout?: SliderLayout;
    }

    interface RadioLayout extends ObjectLayout {
        size?: number;
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        fgColor?: string;
        labelColor?: string;
    }

    interface RadioNode extends GenericNode {
        type: "vradio" | "hradio";
        layout?: RadioLayout;
    }

    interface VuLayout extends ObjectLayout {
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        labelColor?: string;
        log?: number;
    }

    interface VuNode extends GenericNode {
        type: "vu";
        layout?: VuLayout;
    }

    interface CnvLayout extends ObjectLayout {
        size?: number;
        label?: string;
        labelX?: number;
        labelY?: number;
        labelFont?: string;
        labelFontSize?: number;
        bgColor?: string;
        labelColor?: string;
    
    }

    interface CnvNode extends GenericNode {
        type: "cnv";
        layout?: CnvLayout;
    }

}