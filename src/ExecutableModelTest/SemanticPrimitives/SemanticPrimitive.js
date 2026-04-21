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
     * @param {Object} args Input arguments
     */
    validate_inputs (args) {
        // To be implemented by subclasses
    }

    /**
     * Apply the transformations defined by the primitive
     * to the world state.
     * @returns {Object} The updated state of the world
     */
    apply_transformations () {
        // To be implemented by subclasses
    }
};

export default SemanticPrimitive;
