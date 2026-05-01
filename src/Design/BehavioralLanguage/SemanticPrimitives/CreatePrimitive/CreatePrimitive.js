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
        const expectedArgs = ["targetParticipantName", "type"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.targetParticipantName = args.targetParticipantName;
        this.type = args.type;
    }

    apply_transformations () {
        if (this.type === "list") {
            this.worldState[this.targetParticipantName] = [];
        } else if (this.type === "object") {
            this.worldState[this.targetParticipantName] = {};
        } else if (this.type === "string") {
            this.worldState[this.targetParticipantName] = "";
        } else if (this.type === "number") {
            this.worldState[this.targetParticipantName] = 0;
        } else if (this.type === "null") {
            this.worldState[this.targetParticipantName] = null;
        } else {
            throw new Error(`Unsupported type "${this.type}" for create primitive.`);
        }

        return this.worldState;
    }
}

export default CreatePrimitive;
