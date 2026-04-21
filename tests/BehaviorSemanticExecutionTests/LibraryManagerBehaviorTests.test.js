import {describe, expect, it} from "vitest";

import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

describe("tests the behaviors in the library manager", () => {

    it("accepts a book", async () => {

        // Creates a pending book
        let behavior = new ExecutableBehavior();
        behavior.addPrimitive("create pendingBook");
        behavior.setPreWorldState({});
        behavior.setPostWorldState({pendingBook: {}});
        behavior.setArgs({initialValue: {}});
        let [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.pendingBook).toEqual({});


        // Accepts a book name
        behavior = new ExecutableBehavior();
        behavior.addPrimitive("create tempName");
        behavior.addPrimitive('set pendingBook tempName ["name"]');
        behavior.addPrimitive("remove tempName");
        behavior.setArgs({initialValue: "Harry Potter"});
        behavior.setPreWorldState(updatedParticipants);
        behavior.setPostWorldState({pendingBook: {"name": "Harry Potter"}});
        [updatedParticipants, isValid] = behavior.computeTransformations();
        expect(isValid).toBe(true);
        expect(updatedParticipants.pendingBook).toEqual({"name": "Harry Potter"});
    });
});
