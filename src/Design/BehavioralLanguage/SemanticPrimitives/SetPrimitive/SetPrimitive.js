import SemanticPrimitive from "../SemanticPrimitive.js";

class SetPrimitive extends SemanticPrimitive {
    /**
     * This is the semantic definition of the set operation. This class
     * accepts the necessary inputs and computes the transformation that
     * realizes the meaning of the set operation.
     *
     * Syntax: set <target_participant> <value_participant> [keys]
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

    /**
     * Returns metadata necessary to synthesize code for the set primitive.
     * This method is used by the code synthesis process to understand how to
     * generate code that realizes the semantics of the set operation.
     *
     * Example:
     * {
     *   targetParticipantName: "book",
     *   keys: ["name"],
     *   valueParticipantName: "Harry Potter"
     * }
     *
     * book["name"] = "Harry Potter"
     *
     * @returns {Object} Metadata to synthesize program.
     */
    get_synthesis_meta () {
        return {
            primitive: "set",
            targetParticipantName: this.targetParticipantName,
            keys: this.keys,
            valueParticipantName: this.valueParticipantName,
        };
    }

    apply_transformations () {
        const value = this.worldState[this.valueParticipantName];
        let target = this.worldState[this.targetParticipantName];

        if (this.keys && this.keys.length > 0) {
            for (const [index, key] of this.keys.entries()) {
                if (index === this.keys.length - 1) {
                    target[key] = value;
                } else {
                    target = target[key];
                }
            }
        } else {
            this.worldState[this.targetParticipantName] = value;
        }
        return this.worldState;
    }
}

export default SetPrimitive;
