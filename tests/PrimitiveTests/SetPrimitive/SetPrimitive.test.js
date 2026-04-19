
import {describe, expect, it} from "vitest";

import SetPrimitive from "../../../src/BehaviorV2Test/SemanticPrimitives/SetPrimitive.js"

describe("tests the set primitive", () => {

    it("tests adding inputs to set primitive", async () => {

        const input = {
            targetVarName: "myVar",
            key: "name",
            valueVarName: "newValue",
        }

        const preConditions = {
            "myVar": {name: "myVar", value: null},
            "newValue": "new name",
        }

        const postConditions = {
            "myVar": {name: "new name", value: null},
        }

        const p = new SetPrimitive(input, preConditions, postConditions);

        p.validate_inputs(input);

        // Apply the transform and check if value is set
        p.apply_transformations();
        expect(p.preconditions[p.target][p.key]).toBe("new name");
    });
});
