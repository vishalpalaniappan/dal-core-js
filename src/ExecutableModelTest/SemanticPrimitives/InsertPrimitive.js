import isEqual from "lodash/isEqual";

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
     * It is a declarative semantic rule that the engine can
     * execute to derive the expected post-state, not an
     * implementation of how the program performs the operation.
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

        this.targetParticipantName = args.targetParticipantName;
        this.key = args.key;
        this.valueParticipantName = args.valueParticipantName;
        this.index = args.index;
    }

    apply_transformations () {
        const expected = structuredClone(this.preconditions);
        const targetList = expected[this.targetParticipantName]._value[this.key];
        const valueToInsert = expected[this.valueParticipantName]._value;

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
        this.expectedPostconditions = expected;
        return expected;
    }

    evaluate_transformation_validity () {
        if (!this.expectedPostconditions) {
            throw new Error("Transformation has not been applied yet.");
        }

        const participantName = this.targetParticipantName;
        const expectedValue = this.expectedPostconditions[participantName]._value[this.key];
        const actualValue = this.postconditions[participantName]._value[this.key];

        return isEqual(expectedValue, actualValue);
    }
}

export default InsertPrimitive;
