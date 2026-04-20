import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js"
import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";
import ExecutableBehavior from "../../src/ExecutableModelTest/ExecutableBehavior.js";


const showWorldState = (participants) => {
    console.log("World State:");
    for (const key in participants) {
        console.log(`Participant: ${key}, Value:`, participants[key].getValue());
    }
}

const createParticipant = (name, value) => {
    const participant = new Participant({name: name, description: ""});
    participant.setValue(value);
    return participant;
}

describe("behaviors semantic execution tests", () => {

    it("tests simple behavioral execution using primitives", async () => {

        const parser = new BehavioralLanguageParser();

        // Transformation #1
        let participants = {
            book: createParticipant("book", {"name": "BOOK1"}),
            shelf: createParticipant("shelf", {}),
        };

        let participants_post = {
            book: createParticipant("book", {"name": "BOOK1"}),
            shelf: createParticipant("shelf", {"slotB": {"name": "BOOK1"}}),
        };

        // This transformation will be correct, post state will place book
        // in shelf on slotB and the evaluation will return true.
        showWorldState(participants);
        const [updatedParticipants, isValid] = parser.execute(
            'set shelf book ["slotB"]', participants, participants_post
        );
        expect(isValid).toBe(true);
        showWorldState(updatedParticipants);

        // Transformation #2
        participants = {
            book: createParticipant("book", {"name": "BOOK1"}),
            shelf: createParticipant("shelf", {}),
        };

        participants_post = {
            book: createParticipant("book", {"name": "BOOK1"}),
            shelf: createParticipant("shelf", {"slotB": {"name": "BOOK1"}}),
        };

        // This transformation will be incorrect, the behavior will place the
        // book in slotC but the post conditions has the book in slotB.
        showWorldState(participants);
        const [updatedParticipants2, isValid2] = parser.execute(
            'set shelf book ["slotC"]', participants, participants_post
        );
        expect(isValid2).toBe(false);
        showWorldState(updatedParticipants2);
    });

    it("tests insert primitive execution", async () => {
        const parser = new BehavioralLanguageParser();

        const preconditions = {
            basket: createParticipant("basket", {"contents": ["pen", "pencil"]}),
            book: createParticipant("book", "notebook"),
        };

        const postconditions = {
            basket: createParticipant("basket", {"contents": ["notebook", "pen", "pencil"]}),
            book: createParticipant("book", "notebook"),
        };

        showWorldState(preconditions);
        const [updatedParticipants, isValid] = parser.execute(
            'insert book basket ["contents"] 0', preconditions, postconditions
        );
        expect(isValid).toBe(true);
        showWorldState(updatedParticipants);
    });


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

        behavior.setPreWorldState({
            basket: createParticipant("basket", {"contents": []}),
            book: createParticipant("book", {"name": ""}),
            name: createParticipant("name", "notebook"),
        });

        behavior.setPostWorldState({
            basket: {"contents": [{"name": "notebook"}]},
            book: {"name": "notebook"},
            name: "notebook",
        });
    });
});
