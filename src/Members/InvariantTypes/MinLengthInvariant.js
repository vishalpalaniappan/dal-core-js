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
                properties: [
                    {
                        key: "key",
                        label: "Key of value in object",
                        type: "Array",
                        required: true,
                    },
                    {
                        key: "value",
                        label: "Minimum Length",
                        type: "string",
                        required: true,
                    },
                ],
            }
        )
    }

    /**
     * This function evaluates the invariant based on the provided state and
     * configuration. The configuration will include the properties of the
     * invariant type (e.g. key and value for the min length invariant type).
     *
     * @param {Object} state The state of the participant to evaluate the
     * invariant on.
     * @param {Object} config The configuration for the invariant evaluation.
     * This will include the properties of the invariant type (e.g. key and
     * value for the min length invariant type).
     * @returns {Boolean} Whether the invariant is satisfied or not.
     */
    evaluate (state, config) {

    };
}
