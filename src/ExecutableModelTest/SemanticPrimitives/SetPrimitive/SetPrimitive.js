import SemanticPrimitive from "../SemanticPrimitive.js";

class SetPrimitive extends SemanticPrimitive {
    /**
     * This is the semantic definition of the set operation. This class
     * accepts the necessary inputs and computes the transformation that
     * realizes the meaning of the set operation.
     *
     * See README for details on how to use the primitive.
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
        const expectedArgs = ["targetParticipantName", "keys", "valueParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));
        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }
        this.targetParticipantName = args.targetParticipantName;
        this.keys = args.keys;
        this.valueParticipantName = args.valueParticipantName;
    }

    apply_transformations () {
        const value = this.worldState[this.valueParticipantName];
        if (this.keys && this.keys.length > 0) {
            this.worldState[this.targetParticipantName][this.keys[0]] = value;
        } else {
            this.worldState[this.targetParticipantName] = value;
        }
        return this.worldState;
    }
}

export default SetPrimitive;
