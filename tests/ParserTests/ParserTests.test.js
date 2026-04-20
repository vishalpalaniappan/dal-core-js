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

describe("parser tests", () => {

    it("tests a simple parser script", async () => {

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

        // This transformation will be correct, post state will palce book
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
        // book in slotC but the post conditions has the book in sloB.
        showWorldState(participants);
        const [updatedParticipants2, isValid2] = parser.execute(
            'set shelf book ["slotC"]', participants, participants_post
        );
        expect(isValid2).toBe(false);
        showWorldState(updatedParticipants2);
    });
});
