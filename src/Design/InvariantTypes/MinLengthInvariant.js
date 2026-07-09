import {InvariantType} from "./InvariantType"

export class MinLengthInvariant extends InvariantType {

    /**
     * Initializes the min length invariant type with the expected properties:
     * - key: The key of the value in the participant's state to which the
     * invariant should be applied.
     * - value: The minimum length that the value should have.
     */
    constructor () {
        super(
            {
                type: "min_length",
                label: "Minimum Length",
                description: "Ensures a string has a minimum length. If the string is a value\
                 in an object, the key of the value in the object should be specified.",
                properties: {
                    keys: {
                        label: "Key(s) of value in object",
                        type: "Array",
                    },
                    minLength: {
                        label: "Minimum Length",
                        type: "string",
                        required: true,
                    },
                },
            }
        )
    }

    /**
     * This function evaluates the invariant based on the provided state and
     * configuration. The configuration will include the properties of the
     * invariant type (e.g. key and value for the min length invariant type).
     * 
     * Returns true if violated, false if not violated.
     *
     * @param {Object} state The state of the participant to evaluate the
     * invariant on.
     * @returns {Boolean} Whether the invariant is violated or not.
     */
    evaluate (state) {

        let value = state;

        // If keys were provided get value at the key path.
        if (this.properties.keys.value && Array.isArray(this.properties.keys.value)) {
            for (const key of this.properties.keys.value) {
                if (key.trim() === "") continue;
                if (!(key in state)) {
                    // TODO: If the key is not in the state, then invariant
                    // failed. We should throw an error instead of considering
                    // the invariant as failed. Will return to this later.
                    return false;
                }
                value = value[key];
            }
        }

        // True means that the invariant is violated.
        this.invariantViolated = !(
            typeof value === "string" && value.length >= this.properties.minLength.value
        );
        return this.invariantViolated
    };
}
