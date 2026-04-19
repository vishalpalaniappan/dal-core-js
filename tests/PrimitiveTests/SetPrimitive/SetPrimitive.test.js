import {describe, expect, it} from "vitest";

import SetPrimitive from "../../../src/BehaviorV2Test/SemanticPrimitives/SetPrimitive.js";

describe("tests the set primitive", () => {

    it("tests adding inputs to set primitive", async () => {
        // Input needed for primitive to perform operation.
        const input = {
            key: "name",
            targetParticipantName: "participantA",
            valueParticipantName: "participantName",
        };

        // Preconditions to apply transform to (and evaluate invariants)
        const preConditions = {
            participantA: {
                name: "oldParticipantName",
                value: null,
            },
            participantName: "new name",
        };

        // Postconditions to check after transform (and evaluate invariants)
        const postConditions = {
            participantA: {
                name: "new name",
                value: null,
            },
        };

        // Create the primitive and validate inputs
        const p = new SetPrimitive(input, preConditions, postConditions);

        // Apply the transform and check if value is set
        const expected = p.apply_transformations();
        expect(expected.participantA.name).toBe("new name");
        expect(preConditions.participantA.name).toBe("oldParticipantName");
        expect(p.evaluate_transformation_validity()).toBe(true);
    });
});
