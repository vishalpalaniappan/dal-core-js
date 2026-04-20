import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js"
import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";


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

        /**
         * Currently, I am setting up so that each invocation of the parser
         * creates a new primitive and applies the transformation. Then the
         * updated world state is propogated forward to the next primitive
         * execution. This means that when a composit primitive in a behavior
         * fails, we can identify which primitive caused the failure instead
         * of just saying the behavior failed without that context.
         */

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
});
