import { InvariantType } from "./InvariantType"

export class RangeInvariant extends InvariantType {

    /**
     * Initializes the range invariant. Verifies that the numeric value
     * falls within the specified range. The range can be inclusive or
     * exclusive, which is determined by the inclusiveMin and inclusiveMax
     * properties.
     */
    constructor() {
        super(
            {
                type: "range",
                label: "Range",
                description: "Ensures a numeric value falls within a specified range (inclusive \
                or exclusive). If the value is within an object, the key of the value should \
                be specified.",
                properties: {
                    keys: {
                        label: "Key(s) of value in object",
                        type: "Array",
                        required: false,
                    },
                    min: {
                        label: "Minimum Value",
                        type: "number",
                        required: false,
                    },
                    max: {
                        label: "Maximum Value",
                        type: "number",
                        required: false,
                    },
                    inclusiveMin: {
                        label: "Inclusive Minimum",
                        type: "boolean",
                        required: false,
                    },
                    inclusiveMax: {
                        label: "Inclusive Maximum",
                        type: "boolean",
                        required: false,
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
     * @param {Number} state The state of the participant to evaluate the
     * invariant on.
     * @returns {Boolean} Whether the invariant is violated or not.
     */
    evaluate (state) {

    };
}
