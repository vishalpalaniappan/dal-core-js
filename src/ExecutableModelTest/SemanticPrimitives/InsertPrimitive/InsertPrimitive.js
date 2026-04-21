import SemanticPrimitive from "../SemanticPrimitive.js";

class InsertPrimitive extends SemanticPrimitive {
    /**
     * This is the semantic definition of the insert operation. This class
     * accepts the necessary inputs and computes the transformation that
     * realizes the meaning of the insert operation.
     *
     * See README for details on how to use the primitive.
     *
     * @param {Object} inputs - The inputs required for the insert operation.
     * @param {Object} worldstate - The state of the world before transformation
     */
    constructor (inputs, worldstate) {
        super("insert");
        this._type = "insert";
        this.validate_inputs(inputs);
        this.worldState = worldstate;
    }

    validate_inputs (args) {
        const expectedArgs = [
            "targetParticipantName",
            "keys",
            "valueParticipantName",
            "index",
        ];
        const missingKeys = expectedArgs.filter(key => !(key in args));

        if (missingKeys.length > 0) {
            throw new Error(`Missing required arguments: ${missingKeys.join(", ")}`);
        }

        this.targetParticipantName = args.targetParticipantName;
        this.keys = args.keys;
        this.valueParticipantName = args.valueParticipantName;
        this.index = args.index;
    }

    apply_transformations () {
        let targetList;
        if (this.keys && this.keys.length > 0) {
            targetList = this.worldState[this.targetParticipantName][this.keys[0]];
        } else {
            targetList = this.worldState[this.targetParticipantName];
        }
        const valueToInsert = this.worldState[this.valueParticipantName];

        if (!Array.isArray(targetList)) {
            throw new Error(`Target key "${this.key}" must reference an array.`);
        }

        if (!Number.isInteger(this.index)) {
            throw new Error("Insert index must be an integer.");
        }

        if (this.index < 0 || this.index > targetList.length) {
            throw new Error(`Insert index ${this.index} is out of bounds.`);
        }

        targetList.splice(this.index, 0, valueToInsert);
        return this.worldState;
    }
}

export default InsertPrimitive;
