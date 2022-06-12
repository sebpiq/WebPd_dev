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

type ConciseNodeBuilders = {
    [nodeType: string]: {
        inletTypes?: Array<PdDspGraph.PortletType>
        outletTypes?: Array<PdDspGraph.PortletType>
        isEndSink?: boolean
        translateArgs?: PdDspGraph.NodeBuilder['translateArgs']
        rerouteConnectionIn?: PdDspGraph.NodeBuilder['rerouteConnectionIn']
        build?: PdDspGraph.NodeBuilder['build']
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
    outlets: {},
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
        Object.entries(partialNode.sinks || {}).forEach(([outletId, sinks]) => {
            graph[sourceId].sinks[outletId] = []
            sinks.forEach(([sinkId, inlet]) => {
                graph[sinkId].sources[inlet] =
                    graph[sinkId].sources[inlet] || []
                graph[sourceId].sinks[outletId].push(
                    makeConnectionEndpoint([sinkId, inlet])
                )
                graph[sinkId].sources[inlet].push(
                    makeConnectionEndpoint([sourceId, outletId])
                )
            })
        })
    })

    return graph
}

export const makeNodeBuilders = (
    conciseNodeBuilders: ConciseNodeBuilders
): PdDspGraph.NodeBuilders => {
    const nodeBuilders: PdDspGraph.NodeBuilders = {}
    Object.entries(conciseNodeBuilders).forEach(([nodeType, entryParams]) => {
        let build: PdDspGraph.NodeBuilder['build']
        if (!entryParams.build) {
            const defaultPortletsTemplate: Array<PdDspGraph.PortletType> = [
                'control',
            ]

            const inletsTemplate: PdDspGraph.PortletMap = {}
            ;(entryParams.inletTypes || defaultPortletsTemplate).map(
                (inletType, i) => {
                    inletsTemplate[`${i}`] = {
                        type: inletType,
                        id: i.toString(10),
                    }
                }
            )

            const outletsTemplate: PdDspGraph.PortletMap = {}
            ;(entryParams.outletTypes || defaultPortletsTemplate).map(
                (outletType, i) => {
                    outletsTemplate[`${i}`] = {
                        type: outletType,
                        id: i.toString(10),
                    }
                }
            )

            build = () => {
                let extraArgs: Partial<PdDspGraph.Node> = {}
                if (entryParams.isEndSink) {
                    extraArgs = { isEndSink: entryParams.isEndSink }
                }
                return {
                    ...extraArgs,
                    inlets: inletsTemplate,
                    outlets: outletsTemplate,
                }
            }
        }

        nodeBuilders[nodeType] = {
            build: entryParams.build || build,
            translateArgs: entryParams.translateArgs || (() => ({})),
            rerouteConnectionIn: entryParams.rerouteConnectionIn || undefined,
        }
    })
    return nodeBuilders
}
