declare module PdEngine {

    // Code stored in string variable for later evaluation.
    type Code = string

    // Name of a variable in generated code
    type CodeVariableName = string

    // Code that allows to create a SignalProcessor when evaled
    type SignalProcessorCode = Code

    interface SignalProcessor {
        loop: () => Float32Array
        ports: { [portName: string]: (...args: any) => any }
    }

    interface Settings {
        sampleRate: number
        channelCount: number
    }

}