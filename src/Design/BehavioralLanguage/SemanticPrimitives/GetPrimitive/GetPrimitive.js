import SemanticPrimitive from "../SemanticPrimitive.js";

class GetPrimitive extends SemanticPrimitive {
    /**
     * This is the semantic definition of the get operation. This class
     * accepts the necessary inputs and computes the transformation that
     * realizes the meaning of the get operation.
     *
     * Syntax: get <from> ["keys"] <target>
     *
     * See README for details on how to use the primitive.
     *
     * @param {Object} inputs - The inputs required for the get operation.
     * @param {Object} worldstate - The state of the world before transformation
     */
    constructor (inputs, worldstate) {
        super("get");
        this._type = "get";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
        this.re = /^get\s+(.+?)(?:\s+(\[[^\]]*\]))?\s+(.+)$/;
    }

    validate_inputs (args) {
        const expectedArgs = ["sourceParticipantName", "keys", "targetParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));
        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }
        this.sourceParticipantName = args.sourceParticipantName;
        this.keys = args.keys;
        this.targetParticipantName = args.targetParticipantName;
    }

    get_synthesis_meta () {
        return {
            type: "get",
            targetParticipantName: this.targetParticipantName,
            keys: this.keys,
            sourceParticipantName: this.sourceParticipantName,
        };
    }

    apply_transformations () {
        let value = this.worldState[this.sourceParticipantName];

        let target = value;
        if (this.keys && this.keys.length > 0) {
            for (const key of this.keys) {
                if (!(key in target)) {
                    throw new Error(`Key "${key}" does not exist on target path.`);
                }
                target = target[key];
            }
        }

        this.worldState[this.targetParticipantName] = target;
        return this.worldState;
    }
}

export default GetPrimitive;
