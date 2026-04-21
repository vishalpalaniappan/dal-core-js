import SemanticPrimitive from "../SemanticPrimitive.js";

class RemoveKeyPrimitive extends SemanticPrimitive {
    /**
     * This is the semantic definition of the removekey operation. This class
     * accepts the necessary inputs and computes the transformation that
     * realizes the meaning of the removekey operation.
     *
     * See README for details on how to use the primitive.
     *
     * @param {Object} inputs - The inputs required for the removekey operation.
     * @param {Object} worldstate - The state of the world before transformation
     */
    constructor(inputs, worldstate) {
        super("remove_key");
        this._type = "remove_key";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs(args) {
        const expectedArgs = ["targetParticipantName", "key"];
        const missingKeys = expectedArgs.filter(key => !(key in args));
        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.targetParticipantName = args.targetParticipantName;
        this.key = args.key;
    }

    apply_transformations() {
        const participant = this.worldState[this.targetParticipantName];

        if (!participant) {
            throw new Error(
                `Participant "${this.targetParticipantName}" does not exist in world state.`
            );
        }

        delete participant[this.key];
        return this.worldState;
    }
}

export default RemoveKeyPrimitive;
