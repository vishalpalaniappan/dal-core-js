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

        const p1 = createParticipant("book", {"name": "BOOK1"});
        const p2 = createParticipant("shelf", {});

        const p1_post = createParticipant("book", {"name": "BOOK1"});
        const p2_post = createParticipant("shelf", {"slotB": {"name": "BOOK1"}});

        const participants = {book: p1, shelf: p2};
        const participants_post = {book: p1_post, shelf: p2_post};

        showWorldState(participants);

        const parser = new BehavioralLanguageParser();

        parser.execute('set shelf book ["slotB"]', participants, participants_post);
        showWorldState(participants);
    });
});
