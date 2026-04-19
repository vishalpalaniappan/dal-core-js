import SemanticPrimitive from "./SemanticPrimitive.js";

class InsertPrimitive extends SemanticPrimitive {
    /**
     * This primitive represents the semantic definition of the insert op
     * It defines the inputs, preconditions, transformation, and postconditions
     * required to both compute the resulting state and verify the correctness
     * of the transformation from the observed trace.
     *
     * The insert primitive will have the following participants:
     * - The target variable whose list value is being modified.
     * - The key of the target variable that contains the list.
     * - The value that is being inserted into the list.
     * - The index at which the value should be inserted.
     *
     * This semantic definition specifies that the provided value is inserted
     * into the target list at the provided index. The expected postcondition
     * is derived from the precondition and the transformation. This does not
     * implement the program's insert operation, but instead defines its
     * semantic meaning and computes it. It is a declarative semantic rule
     * that the engine can execute to derive the expected post-state, not an
     * implementation of how the program performs the operation.
     *
     * Process:
     * - The invariants of the precondition will be validated before the
     *   transformation is applied.
     * - The transformation will insert the value and then the post conditions
     *   will be evaluated to check if the transformation is valid.
     * - The invariants of the post conditions will be validated after the
     *   transformation is applied.
     *
     * @param {Object} inputs - The inputs required for the insert operation.
     * @param {Object} preconditions - The preconditions of this operation.
     * @param {Object} postconditions - The postconditions of this operation.
     */
    constructor (inputs, preconditions, postconditions) {
        super("insert");
        this._type = "insert";
        this.validate_inputs(inputs);
        this.preconditions = preconditions;
        this.postconditions = postconditions;
    }

    validate_inputs (args) {
        const expectedArgs = [
            "targetParticipantName",
            "key",
            "valueParticipantName",
            "index",
        ];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.target = args.targetParticipantName;
        this.key = args.key;
        this.value = args.valueParticipantName;
        this.index = args.index;
    }

    process_preconditions () {
        // Skipping for now, here I will evaluate the invariants.
    }

    process_postconditions () {
        // Skipping for now, here I will evaluate the invariants.
    }

    apply_transformations () {
        const targetList = this.preconditions[this.target][this.key];
        const valueToInsert = this.preconditions[this.value];

        if (!Array.isArray(targetList)) {
            throw new Error(`Target key "${this.key}" must reference an array.`);
        }

        if (!Number.isInteger(this.index)) {
            throw new Error("Insert index must be an integer.");
        }

        if (this.index < 0 || this.index > targetList.length) {
            throw new Error(`Insert index ${this.index} is out of bounds.`);
        }

        targetList.splice(this.index, 0, valueToInsert);

        if (this.evaluate_transformation_validity()) {
            console.log("Transformation applied successfully and is valid.");
        } else {
            console.error("Transformation applied but is invalid.");
        }
    }

    evaluate_transformation_validity () {
        const expectedValue = this.preconditions[this.target][this.key];
        const actualValue = this.postconditions[this.target][this.key];

        // TODO: Temporary, lots of issues with this, will revisit soon.
        // Exploring the larger structure before I work through the details.
        return JSON.stringify(expectedValue) === JSON.stringify(actualValue);
    }
}

export default InsertPrimitive;
