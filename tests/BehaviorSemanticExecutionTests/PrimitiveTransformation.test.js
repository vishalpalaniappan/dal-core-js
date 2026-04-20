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
        const updatedParticipants = parser.execute(
            'set shelf book ["slotB"]', participants, participants_post
        );
        showWorldState(updatedParticipants);

        console.log("");

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
        const updatedParticipants2 = parser.execute(
            'set shelf book ["slotC"]', participants, participants_post
        );
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
        const updatedParticipants = parser.execute(
            'insert book basket ["contents"] 0', preconditions, postconditions
        );
        showWorldState(updatedParticipants);
    });
});
