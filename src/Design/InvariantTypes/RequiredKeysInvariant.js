import {InvariantType} from "./InvariantType"

export class RequiredKeysInvariant extends InvariantType {

    /**
     * Initializes the required keys invariant type with the expected properties:
     * - keys: The key path to the array in the participant's state.
     * - requiredKeys: The list of keys that every object in the array must contain.
     */
    constructor () {
        super(
            {
                type: "required_keys",
                label: "Required Keys",
                description: "Ensures that every object in an array contains all required keys. \
                If the array is nested in an object, the key path to the array should be specified.",
                properties: {
                    keys: {
                        label: "Key(s) of array in object",
                        type: "Array",
                    },
                    requiredKeys: {
                        label: "Required Keys",
                        type: "Array",
                        required: true,
                    },
                },
            }
        )
    }

    /**
     * Evaluates the invariant based on the provided state and configuration.
     *
     * Returns true if violated, false if not violated.
     *
     * @param {Object} state The state of the participant to evaluate the invariant on.
     * @returns {Boolean} Whether the invariant is violated or not.
     */
    evaluate (state) {

        let value = state;
        for (const key of this.properties.keys.value) {
            if (key.trim() === "") continue;
            if (!(key in value)) {
                // If the key is not in the state,
                // we consider the invariant to be not evaluable / not violated.
                // TODO: Needs some more thought.
                return false;
            }
            value = value[key];
        }

        this.invariantViolated = !(
            Array.isArray(value) &&
            value.every(
                (item) =>
                    item &&
                    typeof item === "object" &&
                    this.properties.requiredKeys.value.every((requiredKey) => requiredKey in item)
            )
        );

        return this.invariantViolated;
    };
}