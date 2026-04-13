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
                        required: true,
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
        for (const key of this.properties.keys.value) {
            if (!(key in state)) {
                // If the key is not in the state,
                // we consider the invariant to be violated.
                // TODO: Needs some more thought.
                return false;
            }
            value = value[key];
        }

        // True means that the invariant is violated.
        this.invariantViolated = !(
            typeof value === "string" && value.length >= this.properties.minLength.value
        );
        return this.invariantViolated
    };
}
