import BehavioralControlGraph from "../Design/BehavioralControlGraph/BehavioralControlGraph";
import TraceDebugger from "./TraceDebugger";

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
     * and implemented. The execution trace cannot be debugged autoamtically,
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
     * @param {Object} decompressedLogs
     */
    addTrace (trace, decompressedLogs) {
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

        /**
         * TODO:
         * I am not incuding the clp-ffi-js library in the engine right now
         * because it keeps things simpler while I workout some build issues.
         * This means that when the trace is added, I accept the externally
         * decompressed log files, debug it and save the results in the trace
         * file. In the future, I would decompress the file in the engine
         * and save the results in the trace object.
         *
         * Note:
         * I should also say that with CLP, we don't need to fully decompress
         * the log file to actually do the debugging. The entire process is
         * optimized. Knowing the domain structure of the data means that we
         * can work with it in an optimal way. There is no wasted movement here,
         * we won't be performing any more computation than is necessary to
         * get the results of the automated debugging.
         *
         * Temporarily disbling the debugger while I shift the storage of traces
         * from the implementation to this class in the workbench and tests.
         */
        // trace.debugResults = new TraceDebugger(this._design, decompressedLogs).results;

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
