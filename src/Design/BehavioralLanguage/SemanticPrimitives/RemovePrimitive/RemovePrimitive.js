import SemanticPrimitive from "../SemanticPrimitive.js";

class RemovePrimitive extends SemanticPrimitive {
    /**
     * Semantic definition of remove. Removes a participant from
     * the world state.
     *
     * Syntax: remove <participant>
     *
     * See README for details on how to use the primitive.
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor (inputs, worldstate) {
        super("remove");
        this._type = "remove";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
        this.re = /^remove\s+(.+?)$/;
    }

    validate_inputs(args) {
        const expectedArgs = ["targetParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.targetParticipantName = args.targetParticipantName;
    }

    apply_transformations() {
        if (!(this.targetParticipantName in this.worldState)) {
            throw new Error(
                `Participant "${this.targetParticipantName}" does not exist in world state.`
            );
        }

        delete this.worldState[this.targetParticipantName];
        return this.worldState;
    }
}

export default RemovePrimitive;
