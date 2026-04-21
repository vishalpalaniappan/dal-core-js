import SemanticPrimitive from "../SemanticPrimitive.js";

class GetFromPositionPrimitive extends SemanticPrimitive {
    /**
     * Semantic definition:
     * Get value from a position in an indexable source (array or string)
     *
     * Example:
     * getFromPos basket 0 book
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor(inputs, worldstate) {
        super("getFromPos");
        this._type = "getFromPos";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs(args) {
        const expectedArgs = ["sourceParticipantName", "position", "targetParticipantName"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.sourceParticipantName = args.sourceParticipantName;
        this.position = args.position;
        this.targetParticipantName = args.targetParticipantName;
    }

    apply_transformations() {
        const source = this.worldState[this.sourceParticipantName];

        if (source === undefined || source === null) {
            throw new Error(`Source "${this.sourceParticipantName}" does not exist.`);
        }

        // Validate indexable
        if (typeof source !== "string" && !Array.isArray(source)) {
            throw new Error(`Source "${this.sourceParticipantName}" is not indexable.`);
        }

        const index = Number(this.position);

        if (Number.isNaN(index)) {
            throw new Error("Position must be a number.");
        }

        if (index < 0 || index >= source.length) {
            throw new Error(`Index ${index} out of bounds for "${this.sourceParticipantName}".`);
        }

        const value = source[index];

        this.worldState[this.targetParticipantName] = value;

        return this.worldState;
    }
}

export default GetFromPositionPrimitive;