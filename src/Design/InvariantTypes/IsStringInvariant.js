import {InvariantType} from "./InvariantType"

export class IsStringInvariant extends InvariantType {

    constructor () {
        super(
            {
                type: "is_string",
                label: "Is String",
                description: "Ensures the value is of type string. If the value is nested, keys can specify the path.",
                properties: {
                    keys: {
                        label: "Key(s) of value in object",
                        type: "Array",
                    }
                },
            }
        )
    }

    evaluate (state) {

        let value = state;

        // Resolve nested keys (same pattern as your other invariant)
        if (this.properties.keys?.value && Array.isArray(this.properties.keys.value)) {
            for (const key of this.properties.keys.value) {
                if (key.trim() === "") continue;

                if (!(key in value)) {
                    // Same behavior as your current design
                    return false;
                }

                value = value[key];
            }
        }

        // Invariant violated if NOT a string
        this.invariantViolated = !(typeof value === "string");

        return this.invariantViolated;
    }
}