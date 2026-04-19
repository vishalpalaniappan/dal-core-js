export default class Trace {
    /**
     * Crated with an instance of the execution trace.
     * When this object is created, the trace will be
     * automatically debugged using the trace debugger
     * and the results will be available for consuming
     * applications.
     * @param {Object} trace CLP compressed trace file.
     */
    constructor (trace) {
        this._trace = trace;
        this.debug();
    }

    debug () {
    }
}
