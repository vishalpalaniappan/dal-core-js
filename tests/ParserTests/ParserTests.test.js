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


        let p1 = createParticipant("book", {"name": "BOOK1"});
        let p2 = createParticipant("shelf", {});
        let participants = {book: p1, shelf: p2};

        let p1_post = createParticipant("book", {"name": "BOOK1"});
        let p2_post = createParticipant("shelf", {"slotB": {"name": "BOOK1"}});
        let participants_post = {book: p1_post, shelf: p2_post};

        // This transformation will be correct, post state will palce book
        // in shelf on slotB and the evaluation will return true.
        showWorldState(participants);
        const [updatedParticipants, isValid] = parser.execute(
            'set shelf book ["slotB"]', participants, participants_post
        );
        expect(isValid).toBe(true);
        showWorldState(updatedParticipants);


        p1 = createParticipant("book", {"name": "BOOK1"});
        p2 = createParticipant("shelf", {});
        participants = {book: p1, shelf: p2};

        p1_post = createParticipant("book", {"name": "BOOK1"});
        p2_post = createParticipant("shelf", {"slotB": {"name": "BOOK1"}});
        participants_post = {book: p1_post, shelf: p2_post};

        // This transformation will be incorrect, post state will place book
        // in shelf on slotC but the evaluation will return false since the
        // expected post state from the transformation has the book on slotB.
        showWorldState(participants);
        const [updatedParticipants2, isValid2] = parser.execute(
            'set shelf book ["slotC"]', participants, participants_post
        );
        expect(isValid2).toBe(false);
        showWorldState(updatedParticipants2);
    });
});
