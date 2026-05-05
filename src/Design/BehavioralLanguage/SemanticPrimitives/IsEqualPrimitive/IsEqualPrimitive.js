import SemanticPrimitive from "../SemanticPrimitive.js";

class IsEqualPrimitive extends SemanticPrimitive {
    /**
     * Semantic definition of equality comparison.
     *
     * Syntax:
     * isEqual <leftParticipant> <rightParticipant> <target>
     *
     * Compares two participants and stores the boolean
     * result in the target participant.
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor(inputs, worldstate) {
        super("isEqual");
        this._type = "isEqual";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs(args) {
        const expectedArgs = [
            "leftParticipantName",
            "rightParticipantName",
            "targetParticipantName",
        ];

        const missingKeys = expectedArgs.filter(
            key => !(key in args)
        );

        if (missingKeys.length > 0) {
            throw new Error(
                `Missing required arguments: ${missingKeys.join(", ")}`
            );
        }

        this.leftParticipantName = args.leftParticipantName;
        this.rightParticipantName = args.rightParticipantName;
        this.targetParticipantName = args.targetParticipantName;
    }

    apply_transformations() {
        const left =
            this.worldState[this.leftParticipantName];

        const right =
            this.worldState[this.rightParticipantName];

        this.worldState[this.targetParticipantName] =
            left === right;

        return this.worldState;
    }
}

export default IsEqualPrimitive;
