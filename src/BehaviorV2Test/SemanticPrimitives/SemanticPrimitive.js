class SemanticPrimitive {
    /**
     * This is the base class that will be used for all
     * semantic primitives. I am defining the common
     * interface for all the primitives here but each
     * primitive which extends this will have its own
     * implementation of the methods.
     * @param {String} name Name of primitive
     */
    constructor (name) {
        this.name = name;
    }

    validate_inputs() {
        // Valide the inputs of the primitive.
    }

    apply_transformations () {
        // Apply the transformations of the primitive.
    }
};

export default SemanticPrimitive;
