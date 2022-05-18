declare module PdRegistry {

    interface NodeTemplate {
        inflateArgs: (pdJsonArgs: PdJson.ObjectArgs) => PdDspGraph.NodeArguments
        buildInlets: (nodeArgs: PdDspGraph.NodeArguments) => PdDspGraph.PortletMap
        buildOutlets: (nodeArgs: PdDspGraph.NodeArguments) => PdDspGraph.PortletMap
        getIsEndSink?: () => boolean

        // Hook that allows to re-route a connection from the node to a different inlet.
        // Useful for example for inlets in Pd that receive both signal and control, 
        // allows to split connections into pure signal and pure control connection instead.
        rerouteConnectionIn?: (
            outlet: PdDspGraph.Portlet, 
            inletId: PdDspGraph.PortletId
        ) => PdDspGraph.PortletId | undefined
    }

    interface Registry {
        [nodeType: string]: NodeTemplate
    }

}