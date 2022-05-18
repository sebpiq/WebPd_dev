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

export type ConciseGraphConnection = [
    ConciseConnectionEndpoint,
    ConciseConnectionEndpoint
]

type ConcisePdConnection = [
    PdDspGraph.NodeId,
    PdJson.PortletId,
    PdDspGraph.NodeId,
    PdJson.PortletId
]
type ConciseConnectionEndpoint = [PdDspGraph.NodeId, PdDspGraph.PortletId]
type ConcisePatch = Partial<Omit<PdJson.Patch, 'connections'>> & {
    nodes: { [localId: string]: PdJson.Node }
    connections: Array<ConcisePdConnection>
}
type ConcisePd = { patches: { [patchId: string]: ConcisePatch } }
type ConciseNode = {
    sinks?: { [outletId: number]: Array<ConciseConnectionEndpoint> }
    type?: PdSharedTypes.NodeType
    args?: PdDspGraph.NodeArguments
    inlets?: PdDspGraph.PortletMap
    outlets?: PdDspGraph.PortletMap
    isEndSink?: true
}
type ConciseGraph = {
    [pdNodeId: string]: ConciseNode
}

type ConciseRegistry = {
    [nodeType: string]: {
        inletTypes?: Array<PdSharedTypes.PortletType>
        outletTypes?: Array<PdSharedTypes.PortletType>
        isEndSink?: boolean
        inflateArgs?: PdRegistry.NodeTemplate["inflateArgs"]
        rerouteConnectionIn?: PdRegistry.NodeTemplate["rerouteConnectionIn"]
    }
}

export const pdJsonDefaults = (): PdJson.Pd => ({
    patches: {},
    arrays: {},
})

export const pdJsonPatchDefaults = (
    id: PdJson.ObjectGlobalId
): PdJson.Patch => ({
    id,
    nodes: {},
    args: [],
    outlets: [],
    inlets: [],
    connections: [],
})

export const pdJsonNodeDefaults = (id: PdJson.ObjectLocalId): PdJson.Node => ({
    id,
    args: [],
    type: 'DUMMY',
})

export const nodeDefaults = (
    id: PdDspGraph.NodeId,
    type = 'DUMMY'
): PdDspGraph.Node => ({
    id,
    type,
    args: {},
    sources: {},
    sinks: {},
    inlets: {},
    outlets: {}
})

export const makeConnection = (
    conciseConnection: ConcisePdConnection
): PdJson.Connection => ({
    source: {
        nodeId: conciseConnection[0],
        portletId: conciseConnection[1],
    },
    sink: {
        nodeId: conciseConnection[2],
        portletId: conciseConnection[3],
    },
})

export const makeConnectionEndpoint = (
    conciseEndpoint: ConciseConnectionEndpoint
): PdDspGraph.ConnectionEndpoint => ({
    nodeId: conciseEndpoint[0],
    portletId: conciseEndpoint[1],
})

export const makePd = (concisePd: ConcisePd): PdJson.Pd => {
    const pd: PdJson.Pd = pdJsonDefaults()

    Object.entries(concisePd.patches).forEach(([patchId, concisePatch]) => {
        pd.patches[patchId] = {
            ...pdJsonPatchDefaults(patchId),
            ...pd.patches[patchId],
            ...concisePatch,
            connections: concisePatch.connections.map(makeConnection),
        }
    })
    return pd
}

export const makeGraph = (conciseGraph: ConciseGraph): PdDspGraph.Graph => {
    const graph: PdDspGraph.Graph = {}
    Object.entries(conciseGraph).forEach(([nodeId, nodeParams]) => {
        graph[nodeId] = {
            ...nodeDefaults(nodeId),
            ...nodeParams,
            sources: {},
            sinks: {},
        }
    })

    Object.entries(conciseGraph).forEach(([sourceId, partialNode]) => {
        Object.entries(partialNode.sinks || {}).forEach(
            ([outletId, sinks]) => {
                graph[sourceId].sinks[outletId] = []
                sinks.forEach(([sinkId, inlet]) => {
                    graph[sinkId].sources[inlet] = graph[sinkId].sources[inlet] || []
                    graph[sourceId].sinks[outletId].push(
                        makeConnectionEndpoint([sinkId, inlet])
                    )
                    graph[sinkId].sources[inlet].push(makeConnectionEndpoint([
                        sourceId,
                        outletId,
                    ]))
                })
            }
        )
    })

    return graph
}

export const makeRegistry = (
    conciseRegistry: ConciseRegistry
): PdRegistry.Registry => {
    const registry: PdRegistry.Registry = {}
    Object.entries(conciseRegistry).forEach(([nodeType, entryParams]) => {
        const defaultPortletsTemplate: Array<PdSharedTypes.PortletType> = ['control']

        const inletsTemplate: PdDspGraph.PortletMap = {}
        ;(entryParams.inletTypes || defaultPortletsTemplate).map((inletType, i) => {
            inletsTemplate[`${i}`] = {type: inletType}
        })

        const outletsTemplate: PdDspGraph.PortletMap = {}
        ;(entryParams.outletTypes || defaultPortletsTemplate).map((outletType, i) => {
            outletsTemplate[`${i}`] = {type: outletType}
        })

        registry[nodeType] = {
            buildInlets: (): PdDspGraph.PortletMap =>
                inletsTemplate,

            buildOutlets: (): PdDspGraph.PortletMap =>
                outletsTemplate,

            getIsEndSink: () => entryParams.isEndSink || false,

            inflateArgs: entryParams.inflateArgs || (() => ({})),

            rerouteConnectionIn: entryParams.rerouteConnectionIn || undefined
        }
    })
    return registry
}
