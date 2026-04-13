class TraceDebugger {
    /**
     * Initializes a trace debugger that accepts the design and the trace. The
     * design serves as an authoritative semantic model that is used to
     * determine the correctness of the traces behavior and automatically
     * debug it. The result of a debugger being unable to debug a trace is
     * an input into the design that results it in learning new semantics.
     *
     * In this sense, this debugger is a tool for the design to learn new
     * semantics by being exposed to new traces that it cannot explain.
     * It also serves as the authoritative model for testing the traces
     * produced by implementations of the design, meaning, it can be used
     * to verify that the traces produced by implementations are semantically
     * valid and respect the invariants of the design.
     *
     * @param {Object} design The design to use as the authoritative semantic
     * model for debugging.
     * @param {Object} implementation The implementation to use for debugging.
     * @param {String} traceId The ID of the trace to debug.
     */
    constructor (design, implementation, traceId) {
        this._implementation = implementation;
        this._traceId = traceId;
        this._design = design;
    }
}

export default TraceDebugger;
