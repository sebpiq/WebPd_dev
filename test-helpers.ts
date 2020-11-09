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
    ConcisePortletAddress,
    ConcisePortletAddress
]

type ConcisePdConnection = [
    PdDspGraph.NodeId,
    PdDspGraph.PortletId,
    PdDspGraph.NodeId,
    PdDspGraph.PortletId
]
type ConcisePortletAddress = [PdDspGraph.NodeId, PdDspGraph.PortletId]
type ConcisePatch = Partial<Omit<PdJson.Patch, 'connections'>> & {
    nodes: { [localId: string]: PdJson.Node }
    connections: Array<ConcisePdConnection>
}
type ConcisePd = { patches: { [patchId: string]: ConcisePatch } }
type ConciseGraph = {
    [pdNodeId: string]: {
        sinks?: { [outletId: number]: Array<ConcisePortletAddress> }
        type?: PdDspGraph.NodeType
    }
}

type ConciseRegistry = {
    [nodeType: string]: {
        inletType?: PdJson.PortletType
        outletType?: PdJson.PortletType
        isSink?: boolean
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
    sources: {},
    sinks: {},
})

export const makeConnection = (
    conciseConnection: ConcisePdConnection
): PdJson.Connection => ({
    source: {
        id: conciseConnection[0],
        portlet: conciseConnection[1],
    },
    sink: {
        id: conciseConnection[2],
        portlet: conciseConnection[3],
    },
})

export const makePortletAddress = (
    conciseAddress: ConcisePortletAddress
): PdDspGraph.PortletAddress => ({
    id: conciseAddress[0],
    portlet: conciseAddress[1],
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
            ([outletStr, sinkAddresses]) => {
                const outlet = parseFloat(outletStr)
                graph[sourceId].sinks[outlet] = []
                sinkAddresses.forEach(([sinkId, inlet]) => {
                    graph[sourceId].sinks[outlet].push(
                        makePortletAddress([sinkId, inlet])
                    )
                    graph[sinkId].sources[inlet] = makePortletAddress([
                        sourceId,
                        outlet,
                    ])
                })
            }
        )
    })

    return graph
}

export const makeRegistry = (
    conciseRegistry: ConciseRegistry
): PdJson.Registry => {
    const registry: PdJson.Registry = {}
    Object.entries(conciseRegistry).forEach(([nodeType, entryParams]) => {
        registry[nodeType] = {
            getInletType: (): PdJson.PortletType =>
                entryParams.inletType || ('signal' as PdJson.PortletType),
            getOutletType: (): PdJson.PortletType =>
                entryParams.outletType || ('signal' as PdJson.PortletType),
            isSink: () => entryParams.isSink || false,
        }
    })
    return registry
}
