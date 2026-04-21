import isEqual from "lodash/isEqual";

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
     * @param {Object} worldstate - The state of the world before transformation
     */
    constructor (inputs, worldstate) {
        super("set");
        this._type = "set";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
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
        const expectedParticipant = this.worldState[this.targetParticipantName];
        expectedParticipant[this.key] = this.worldState[this.valueParticipantName];
        return this.worldState;
    }
}

export default SetPrimitive;
