declare module PdDspGraph {

    type NodeId = string
    type NodeType = string;

    type PortletId = number;
    interface PortletAddress {
        readonly id: NodeId;
        readonly portlet: PortletId;
    } 
    
    type PortletAddressMap = {[portletId: number]: Array<PortletAddress> | undefined}

    interface Node {
        readonly id: NodeId;
        readonly proto: NodeType;
        readonly sources: {[portletId: number]: PortletAddress | undefined};
        readonly sinks: PortletAddressMap;
    }

    type Graph = { [localId: string]: Node };
    
}