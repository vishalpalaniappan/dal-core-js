class Base {
    /**
     * Initialize the base class of all members of the design.
     * The dal_engine_uid is a unique identifier for each instance.
     * When the design is serialized, the dal_engine_uid is used
     * to identify when the design is being loaded from file.
     * @param {String} name
     */
    constructor () {
        this.dal_engine_uid = crypto.randomUUID();
    }

    /**
     * Returns the type of object as specifed in TYPES.js.
     * (e.g. participant, behavior, invariant, graph node, etc.)
     * @returns {Number} The type of node.
     */
    getType () {
        return this._type;
    }
}

export default Base;
