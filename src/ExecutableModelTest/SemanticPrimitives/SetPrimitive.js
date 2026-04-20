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
     * It is a declarative semantic rule that the engine can execute to derive
     * the expected post-state, not an implementation of how the program
     * performs the set operation.
     *
     * @param {Object} inputs - The inputs required for the set operation.
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
        this.targetParticipantName = args.targetParticipantName;
        this.key = args.key;
        this.valueParticipantName = args.valueParticipantName;
    }

    apply_transformations () {
        // Cloning causes the participant to lose its class type, so I reassign
        // values after. I know its not ideal but works for now, I should create
        // a proper clone method for participant that preserves class type.
        const expected = structuredClone(this.preconditions);

        // Expected participant after transformations are applied.
        // This is the participant being assigned the value in the set operation
        const expectedParticipant = expected[this.targetParticipantName]._value;
        expectedParticipant[this.key] = expected[this.valueParticipantName]._value;

        this.expectedPostconditions = expected;

        return expected;
    }

    evaluate_transformation_validity () {
        if (!this.expectedPostconditions) {
            throw new Error("Transformation has not been applied yet.");
        }

        return this.expectedPostconditions[this.targetParticipantName]._value[this.key] ===
            this.postconditions[this.targetParticipantName]._value[this.key];
    }
}

export default SetPrimitive;
