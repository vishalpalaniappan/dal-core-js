import SemanticPrimitive from "../SemanticPrimitive.js";

class RemoveFromPositionPrimitive extends SemanticPrimitive {
    /**
     * Semantic definition:
     * Remove element at position from a list
     *
     * Example:
     * removeFromPos <source> 0
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor (inputs, worldstate) {
        super("removeFromPos");
        this._type = "removeFromPos";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs (args) {
        const expectedArgs = ["sourceParticipantName", "position"];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.sourceParticipantName = args.sourceParticipantName;
        this.position = args.position;
    }

    apply_transformations() {
        const target = this.worldState[this.sourceParticipantName];

        if (target === undefined || target === null) {
            throw new Error(`Target "${this.sourceParticipantName}" does not exist.`);
        }

        if (!Array.isArray(target)) {
            throw new Error(`Target "${this.sourceParticipantName}" is not a list.`);
        }

        const index = Number(this.position);

        if (Number.isNaN(index)) {
            throw new Error("Position must be a number.");
        }

        if (index < 0 || index >= target.length) {
            throw new Error(`Index ${index} out of bounds for "${this.sourceParticipantName}".`);
        }

        target.splice(index, 1);

        return this.worldState;
    }
}

export default RemoveFromPositionPrimitive;
