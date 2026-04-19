import {describe, expect, it} from "vitest";

import InsertPrimitive from "../../src/BehaviorV2Test/SemanticPrimitives/InsertPrimitive.js";

describe("tests the insert primitive", () => {

    it("tests adding inputs to insert primitive", async () => {
        // Input needed for primitive to perform operation.
        const input = {
            key: "contents",
            targetParticipantName: "participantA",
            valueParticipantName: "participantValue",
            index: 0,
        };

        // Preconditions to apply transform to (and evaluate invariants)
        const preConditions = {
            participantA: {
                contents: ["b", "c"],
            },
            participantValue: "a",
        };

        // Postconditions to check after transform (and evaluate invariants)
        const postConditions = {
            participantA: {
                contents: ["a", "b", "c"],
            },
        };

        // Create the primitive and validate inputs
        const p = new InsertPrimitive(input, preConditions, postConditions);

        // Apply the transform and check if value is inserted
        p.apply_transformations();
        expect(p.preconditions[p.target][p.key]).toEqual(["a", "b", "c"]);
    });
});
