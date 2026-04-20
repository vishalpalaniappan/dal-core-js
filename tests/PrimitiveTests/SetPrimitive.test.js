import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js";
import SetPrimitive from "../../src/ExecutableModelTest/SemanticPrimitives/SetPrimitive.js";

describe("tests the set primitive", () => {

    it("tests adding inputs to set primitive", async () => {

        const targetParticipant = new Participant({name: "participantA", description: ""});
        targetParticipant.setValue({name: "oldParticipantName", value: null});
        const valueParticipant = new Participant({name: "participantName", description: ""});
        valueParticipant.setValue("new name");

        // Input needed for primitive to perform operation.
        const input = {
            key: "name",
            targetParticipantName: "participantA",
            valueParticipantName: "participantName",
        };

        // Preconditions to apply transform to (and evaluate invariants)
        const preConditions = {
            participantA: targetParticipant,
            participantName: valueParticipant,
        };

        const postParticipant = new Participant({name: "participantA", description: ""});
        postParticipant.setValue({name: "new name", value: null});

        // Postconditions to check after transform (and evaluate invariants)
        const postConditions = {
            participantA: postParticipant,
        };

        // Create the primitive and validate inputs
        const p = new SetPrimitive(input, preConditions, postConditions);

        // Apply the transform and check if value is set
        const expected = p.apply_transformations();
        expect(expected.participantA._value.name).toBe("new name");
        expect(preConditions.participantA._value.name).toBe("oldParticipantName");
        expect(p.evaluate_transformation_validity()).toBe(true);
    });
});
