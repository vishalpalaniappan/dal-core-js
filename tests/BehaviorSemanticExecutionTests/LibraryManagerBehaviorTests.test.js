import {describe, expect, it} from "vitest";

import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

describe("tests the behaviors in the library manager", () => {

    it("tests the accept book behavior", async () => {
        // Set the value of bookCopy to be book
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive("create pendingBook");
        behavior.setPreWorldState({});
        behavior.setPostWorldState({pendingBook: null});
        const [updatedParticipants, isValid] = behavior.computeTransformations({
            pendingBook: null,
        });
        expect(isValid).toBe(true);
        expect(updatedParticipants.pendingBook).toBe(null);
    });
});
