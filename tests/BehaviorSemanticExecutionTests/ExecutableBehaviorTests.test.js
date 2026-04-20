import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js"
import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";

const createParticipant = (name, value) => {
    const participant = new Participant({name: name, description: ""});
    participant.setValue(value);
    return participant;
}

describe("behaviors semantic execution tests", () => {


    it("creates a behavior with multiple primitives and executes transformation", async () => {
        /**
         * Once insert primitive is ready, this test will create behavior named:
         * "UpdateBookNameAndAddToBasket"
         *
         * This behavior will set a books name and then add it to the basket:
         * set book name ["name"]
         * insert book basket ["contents"] 0
         *
         * The initial participants of the world are a book with an empty name
         * and an empty basket. The first primitive will set the books name and
         * update the world state, then the second primitive will insert the
         * book into the basket.
         *
         * The expected post state of the behavior will then be available
         * and it will be compared to the actual post state observed from the
         * execution. This will then validate whether the implementation
         * realized the behavior correctly as determined by its semantics.
         *
         * Then I will also enforce any invariants on the pre and post state
         * of the behavior. If the pre-behavior invariants are violated, then
         * the behavior is semantically invalid and it can predict failures
         * downstream.
         *
         * The transformation being invalid can also be a root cause of
         * a downstream failure. If the transformation failed to place the
         * book in the basket, then any downstream behavior that relies on
         * the book could fail. The reason I say "could" is because it depends
         * on how the transformation failed, if a book was placed in the basket
         * but it was the wrong book, then it is hard to be specific about which
         * behavior will fail. However, it is clear that the world is in a
         * semantically invalid state because of this transformation failing.
         *
         * If the post behavior invariants are violated but the pre behavior
         * invariants are not violated and the transformation was valid, then
         * the design is inconsistent. Meaning that everything went according to
         * the design but it still considers the state invalid.
         */

        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('set book name ["name"]');
        behavior.addPrimitive('insert book basket ["contents"] 0');

        const basket = createParticipant("basket", {"contents": []});
        const book = createParticipant("book", {"name": ""});
        const name = createParticipant("name", "test");

        behavior.setPreWorldState({
            basket: basket,
            book: book,
            name: name,
        });

        // Note: I have to set the values in this way because the UID's of the
        // participants are different if I create a new participant. A reminder
        // for myself:
        // TODO: Create proper clone method for participant that preserves UID.
        behavior.setPostWorldState({
            basket: basket.clone({"contents": [{"name": "test"}]}),
            book: book.clone({"name": "test"}),
            name: name.clone("test"),
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();

        expect(isValid).toBe(true);
        expect(updatedParticipants.book._value.name).toBe("test");
        expect(updatedParticipants.basket._value.contents[0].name).toBe("test");
    });


    it("creates a behavior and executes transfor with invalid post state", async () => {
        const behavior = new ExecutableBehavior();
        behavior.addPrimitive('set book name ["name"]');
        behavior.addPrimitive('insert book basket ["contents"] 0');

        const basket = createParticipant("basket", {"contents": []});
        const book = createParticipant("book", {"name": ""});
        const name = createParticipant("name", "test");

        behavior.setPreWorldState({
            basket: basket,
            book: book,
            name: name,
        });

        // Note: I have to set the values in this way because the UID's of the
        // participants are different if I create a new participant. A reminder
        // for myself:
        // TODO: Create proper clone method for participant that preserves UID.
        behavior.setPostWorldState({
            basket: basket.clone({"contents": [{"name": ""}]}),
            book: book.clone({"name": "test"}),
            name: name.clone("test"),
        });

        const [updatedParticipants, isValid] = behavior.computeTransformations();

        expect(isValid).toBe(false);
        expect(updatedParticipants.book._value.name).toBe("test");
        expect(updatedParticipants.basket._value.contents[0].name).toBe("test");
    });
});
