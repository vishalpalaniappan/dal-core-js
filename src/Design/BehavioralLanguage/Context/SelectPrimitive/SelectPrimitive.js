import SemanticPrimitive from "../../SemanticPrimitives/SemanticPrimitive.js";

class SelectPrimitive extends SemanticPrimitive {
    /**
     * Semantic definition of behavior selection.
     *
     * Syntax:
     * select <behaviorName>
     * select <behaviorName> if <flagParticipant>
     *
     * Selects the next behavior to execute.
     * If a flag participant is provided, the behavior
     * is only selected when the flag evaluates to "1".
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor(inputs, worldstate) {
        super("select");
        this._type = "select";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs(args) {
        const expectedArgs = [
            "behaviorName",
        ];

        const missingKeys = expectedArgs.filter(
            key => !(key in args)
        );

        if (missingKeys.length > 0) {
            throw new Error(
                `Missing required arguments: ${missingKeys.join(", ")}`
            );
        }

        this.behaviorName = args.behaviorName;
        this.flagParticipantName =
            args.flagParticipantName || null;
    }

    apply_transformations () {
        // Unconditional selection
        if (!this.flagParticipantName) {
            return {
                "type": "select",
                "nextBehavior": this.behaviorName,
            }
        }

        const flag = this.worldState[this.flagParticipantName];

        // Only select if flag evaluates true
        if (flag === "1") {
            return {
                "type": "select",
                "nextBehavior": this.behaviorName,
            }
        }

        return null;
    }
}

export default SelectPrimitive;
