import SemanticPrimitive from "../SemanticPrimitive.js";

class GetLengthPrimitive extends SemanticPrimitive {
    /**
     * Semantic definition of the getLength operation.
     *
     * Syntax: getLength <participant> <target>
     *
     * Gets the length of the given participant and stores it in target.
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor(inputs, worldstate) {
        super("GetLength");
        this._type = "GetLength";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs(args) {
        const expectedArgs = ["sourceParticipantName", "targetParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.sourceParticipantName = args.sourceParticipantName;
        this.targetParticipantName = args.targetParticipantName;
    }

    apply_transformations() {
        const value = this.worldState[this.sourceParticipantName];

        if (value == null) {
            throw new Error(`Participant "${this.sourceParticipantName}" does not exist.`);
        }

        if (typeof value.length !== "number") {
            throw new Error(`Participant "${this.sourceParticipantName}" does not have a length.`);
        }

        this.worldState[this.targetParticipantName] = value.length;
        return this.worldState;
    }
}

export default GetLengthPrimitive;