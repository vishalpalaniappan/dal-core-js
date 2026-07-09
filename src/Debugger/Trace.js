/**
 * Not used currently:
 * I am just storing it in an object in the traces class, but I should
 * move to using this class so everything is more maintainable.
 */

export default class Trace {
    /**
     * Created with an instance of the execution trace.
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
