import SemanticPrimitive from "./SemanticPrimitive.js";

class SetPrimitive extends SemanticPrimitive {
    /**
     * This primitive represents the semantic definition of the set operation.
     * It defines the inputs, preconditions, transformation, and postconditions
     * required to both compute the resulting state and verify the correctness
     * of the transformation from the observed trace.
     *
     * The set primitive will have the follwing participants:
     * - The target variable whose value is being set.
     * - The key of the target variable that is being set
     *      (if the target variable is a collection).
     * - The value that is being set to the target variable.
     *
     * This semantic definition specifies that the provided value is assigned
     * to the target variable. The expected postcondition is derived from the
     * precondition and the transformation. This does not implement the set
     * operation, but instead defines its semantic meaning and computes it.
     * It is a declarative semantic rule that the engine can execute to derive
     * the expected post-state, not an implementation of how the program
     * performs the operation.
     *
     * Process:
     * - The invariants of the precondition will be validated before the
     * transformation is applied.
     * - The transformation will set the value and then the post conditions
     *   will be evaluated to check if the transformation is valid.
     * - The invariants of the post conditions will be validated after the
     * transformation is applied.
     * @param {Object} inputs - The inputs required for theset operation.
     * @param {Object} preconditions - The preconditions of this operation.
     * @param {Object} postconditions - The postconditions of this operation.
     */
    constructor (inputs, preconditions, postconditions) {
        super("set");
        this._type = "set";
        this.validate_inputs(inputs);
        this.preconditions = preconditions;
        this.postconditions = postconditions;
    }

    validate_inputs (args) {
        const expectedArgs = ["targetParticipantName", "key", "valueParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));
        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }
        this.target = args.targetParticipantName;
        this.key = args.key;
        this.value = args.valueParticipantName;
    }

    process_preconditions () {
        // Skipping for now, here I will evaluate the invariants.
    }

    process_postconditions () {
        // Skipping for now, here I will evaluate the invariants.
    }

    apply_transformations () {
        this.preconditions[this.target][this.key] = this.preconditions[this.value];
    }
}

export default SetPrimitive;
