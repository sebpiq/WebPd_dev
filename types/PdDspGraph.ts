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

declare module PdDspGraph {
    // !!! Characters here should only be [a-zA-Z0-9_] because the code generation (WebPd_copmiler-js)
    // will only support these.
    type NodeId = string

    type NodeArgument = string | number

    type NodeArguments = {[argumentName: string]: NodeArgument}

    type PortletId = string
    
    type PortletType = 'signal' | 'control'

    interface ConnectionEndpoint {
        readonly nodeId: NodeId
        readonly portletId: PortletId
    }

    interface Portlet {
        readonly id: PortletId
        readonly type: PortletType
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

    type GraphTraversal = Array<Node>

    // Patch translation PdJson -> PdDspGraph
    interface PartialNode {
        inlets: Node['inlets']
        outlets: Node['outlets']
        isEndSink?: Node['isEndSink']
    }

    interface NodeBuilder {
        translateArgs: (objectArgs: PdJson.ObjectArgs, patch: PdJson.Patch) => NodeArguments
        build: (nodeArgs: NodeArguments) => PartialNode

        // Hook that allows to re-route a connection from the node to a different inlet.
        // Useful for example for inlets in Pd that receive both signal and control, 
        // allows to split connections into pure signal and pure control connection instead.
        rerouteConnectionIn?: (
            outlet: Portlet, 
            inletId: PortletId
        ) => PortletId | undefined
    }

    interface NodeBuilders {
        [nodeType: string]: NodeBuilder
    }
}