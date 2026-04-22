class SemanticPrimitive {
    /**
     * This is the base class that will be used for all
     * semantic primitives.
     * @param {String} name Name of primitive
     */
    constructor (name) {
        this.name = name;
    }

    /**
     * Validate the inputs to the primitive.
     */
    validate_inputs () {
        throw new Error("validate_inputs must be implemented by primitive subclass");
    }

    /**
     * Apply the transformations defined by the primitive
     * to the world state.
     * @returns {Object} The updated state of the world
     */
    apply_transformations () {
        throw new Error("apply_transformations must be implemented by primitive subclass");
    }
};

export default SemanticPrimitive;
