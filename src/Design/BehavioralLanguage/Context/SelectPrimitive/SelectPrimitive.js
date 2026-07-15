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
     * is only selected when the flag evaluates to true.
     *
     * TODO:
     * After I expand the BSL to include conditional
     * operators, I will move the select primitive to the
     * actual script, where users can write:
     *
     * if <flagParticipant>:
     *    set nextBehavior string <behaviorName>
     *
     * Until I do that, this is a temporary solution to
     * select the next behavior based on the world state
     * so that I can establish the synthesis pipeline.
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

    /**
     * Returns metadata necessary to synthesize code for the set primitive.
     * This method is used by the code synthesis process to understand how to
     * generate code that realizes the semantics of the set operation.
     *
     * Example:
     * {
     *      type: "selectNextBehavior",
     *      nextBehavior: "acceptBook"
     * }
     * 
     * nextBehavior = "acceptBook"
     *
     * Example:
     * {
     *      type: "selectNextBehavior",
     *      nextBehavior: "acceptBook"
     *      flagParticipantName: "isAcceptBook"
     * }
     *
     * if (isAcceptBook):
     *      nextBehavior = "acceptBook"
     *
     * @returns {Object} Metadata to synthesize program.
     */
    get_synthesis_meta () {

        if (this.flagParticipantName !== null) {
            return {
                type: "selectNextBehaviorConditional",
                nextBehavior: this.behaviorName,
                hasFlag: this.flagParticipantName !== null,
                flagParticipantName: this.flagParticipantName,
            };
        } else {
            return {
                type: "selectNextBehavior",
                nextBehavior: this.behaviorName,
            };
        }
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
