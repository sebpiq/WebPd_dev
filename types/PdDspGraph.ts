declare module PdDspGraph {
    type NodeId = string
    type NodeArgument = string | number
    type NodeArguments = {[argumentName: string]: NodeArgument}
    type PortletId = string

    interface ConnectionEndpoint {
        readonly nodeId: NodeId
        readonly portletId: PortletId
    }

    interface Portlet {
        readonly type: PdSharedTypes.PortletType
    }

    type PortletMap = {
        [portletId: string]: Portlet | undefined
    }

    type ConnectionEndpointMap = {
        [portletId: string]: Array<ConnectionEndpoint> | undefined
    }

    interface Node {
        readonly id: NodeId
        readonly type: PdSharedTypes.NodeType
        readonly args: NodeArguments
        readonly sources: ConnectionEndpointMap
        readonly sinks: ConnectionEndpointMap
        readonly isEndSink?: true
        readonly inlets: PortletMap
        readonly outlets: PortletMap
    }

    type Graph = { [nodeId: string]: Node }

    type Arrays = { [arrayName: string]: Float32Array }
}