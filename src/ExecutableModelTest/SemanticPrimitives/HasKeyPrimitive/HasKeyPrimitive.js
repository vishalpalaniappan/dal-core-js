import SemanticPrimitive from "../SemanticPrimitive.js";

class HasKeyPrimitive extends SemanticPrimitive {
    /**
     * Semantic primitive that checks whether a key exists on a participant.
     *
     * Syntax: hasKey sourceParticipantName key targetParticipantName [keys]
     *
     * @param {Object} inputs
     * @param {Object} worldstate
     */
    constructor (inputs, worldstate) {
        super("hasKey");
        this._type = "hasKey";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs(args) {
        const expectedArgs = [
            "sourceParticipantName",
            "keyParticipantName",
            "targetParticipantName",
        ];

        const missingKeys = expectedArgs.filter(k => !(k in args));
        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.sourceParticipantName = args.sourceParticipantName;
        this.keyParticipantName = args.keyParticipantName;
        this.targetParticipantName = args.targetParticipantName;
        this.keys = args.keys ?? [];
    }

    apply_transformations () {
        let source = this.worldState[this.sourceParticipantName];

        if (source === undefined || source === null) {
            throw new Error(`Source "${this.sourceParticipantName}" does not exist.`);
        }

        if (this.keys.length > 0) {
            for (const k of this.keys) {
                if (!(k in source)) {
                    throw new Error(
                        `Key "${k}" does not exist on source "${this.sourceParticipantName}".`
                    );
                }
                source = source[k];
            }
        }

        const exists =
            source !== null &&
            typeof source === "object" &&
            this.worldState[this.keyParticipantName] in source;

        this.worldState[this.targetParticipantName] = exists;

        return this.worldState;
    }
}

export default HasKeyPrimitive;
