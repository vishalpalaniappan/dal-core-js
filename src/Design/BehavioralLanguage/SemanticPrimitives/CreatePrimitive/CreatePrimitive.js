import SemanticPrimitive from "../SemanticPrimitive.js";

class CreatePrimitive extends SemanticPrimitive {
    /**
     * Semantic definition of create.
     * Introduces a new participant into the world state.
     *
     * Syntax: create <participant> <type> [value]
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
        const expectedArgs = ["targetParticipantName", "type", "value"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.targetParticipantName = args.targetParticipantName;
        this.type = args.type;
        this.value = args.value;
    }

    apply_transformations () {
        // TODO: UPDATE README WITH SUPPORTED TYPES AND ADD EXAMPLES

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

        if (this.value !== undefined && this.type === "number") {
            this.worldState[this.targetParticipantName] = Number(this.value);
        } else if (this.value !== undefined && this.type === "string") {
            this.worldState[this.targetParticipantName] = String(this.value);
        } else if (this.value !== undefined && this.type === "list") {
            this.worldState[this.targetParticipantName] = JSON.parse(this.value);
        } else if (this.value !== undefined && this.type === "object") {
            this.worldState[this.targetParticipantName] = JSON.parse(this.value);
        } else if (this.value !== undefined && this.type === "null") {
            this.worldState[this.targetParticipantName] = null;
        } else if (this.value !== undefined) {
            // eslint-disable-next-line max-len
            throw new Error(`Value provided for create primitive does not match type "${this.type}".`);
        }

        return this.worldState;
    }
}

export default CreatePrimitive;
