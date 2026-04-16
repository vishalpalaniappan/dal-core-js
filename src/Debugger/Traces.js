import BehavioralControlGraph from "../Design/BehavioralControlGraph/BehavioralControlGraph";

export default class Traces {
    /**
     * This class contains the execution traces that were produced by
     * the instrumented source. It accepts the design object and the
     * implementation object. When the trace is added to this class,
     * it will get automatically debugged.
     *
     * When the versioning system is added later, this class will
     * look at the version in the trace, load the relevant design
     * and use it to debug the trace. The plan is that when the engine
     * learns from the trace, it creates a new version of the design.
     * So the output of this autoamted debugging process will create
     * new versions that will be used to debug future traces.
     *
     * In many ways this captures the learning loop, a design is created
     * and implemented. The execution trace cannot be debugge autoamtically,
     * so the design learns new semantics, creating a new version. Now the
     * implementation claims to realize that version, so the corresponding
     * design is used to debug the generated trace.
     *
     * Right now, I'm just accepting a single design because I have no
     * versioning setup yet.
     *
     * @param {BehavioralControlGraph} design Control graph of the design.
     */
    constructor (design) {
        this._design = design;
        this._traces = {};
    }
    /**
     * Adds an execution trace to the implementation.
     * @param {Object} trace Trace object to add.
     */
    addTrace (trace) {
        if (typeof trace !== "object" || trace === null) {
            throw new Error("Trace must be a non-null object.");
        }
        const {uid} = trace;
        if (!uid) {
            throw new Error("Trace object must have a UID.");
        }
        if (this._traces[uid]) {
            throw new Error(`Trace with UID ${uid} already exists.`);
        }
        trace.timestamp = new Date().toISOString();
        this._traces[uid] = trace;
    }

    /**
     * Deletes an execution trace from the implementation.
     * @param {String} uid UID of the trace to delete.
     */
    deleteTrace (uid) {
        if (!this._traces[uid]) {
            throw new Error(`Trace with UID ${uid} does not exist.`);
        }
        delete this._traces[uid];
    }

    /**
     * Gets an execution trace from the implementation.
     * @param {String} uid UID of the trace to get.
     * @returns {Object} Trace object with the given UID.
     * @throws {Error} Throws an error if a trace with the given UID does
     * not exist.
     */
    getTrace (uid) {
        if (!this._traces[uid]) {
            throw new Error(`Trace with UID ${uid} does not exist.`);
        }
        return this._traces[uid];
    }
}
