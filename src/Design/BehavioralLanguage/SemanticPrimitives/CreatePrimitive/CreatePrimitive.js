import SemanticPrimitive from "../SemanticPrimitive.js";

class CreatePrimitive extends SemanticPrimitive {
    /**
     * Semantic definition of create.
     * Introduces a new participant into the world state.
     *
     * Syntax: create <participant>
     *
     * Initial value is assigned from intput args. If not provided
     * the value is set to null.
     *
     * See README for details on how to use the primitive.
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor (inputs, worldstate) {
        super("create");
        this._type = "create";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs (args) {
        const expectedArgs = ["targetParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.targetParticipantName = args.targetParticipantName;
        this.initialValue = args.initialValue ?? null;
    }

    apply_transformations () {
        if (this.targetParticipantName in this.worldState) {
            throw new Error(
                `Participant "${this.targetParticipantName}" already exists in world state.`
            );
        }

        const value =
            typeof this.initialValue === "object"
                ? structuredClone(this.initialValue)
                : this.initialValue;

        this.worldState[this.targetParticipantName] = value;

        return this.worldState;
    }
}

export default CreatePrimitive;
