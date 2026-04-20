import {describe, expect, it} from "vitest";

import SetPrimitive from "../../src/BehaviorV2Test/SemanticPrimitives/SetPrimitive.js";
import Participant from "../../src/Design/Participant.js";

describe("tests the set primitive", () => {

    it("tests adding inputs to set primitive", async () => {

        const targetParticipant = new Participant({
            name: "participantA",
            description: "a participant whose name will be set",
        });
        targetParticipant.setValue({
            name: "oldParticipantName",
            value: null,
        });

        const valueParticipant = new Participant({
            name: "participantName",
            description: "a participant that holds the new name to set to the target participant",
        });
        valueParticipant.setValue("new name");

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
