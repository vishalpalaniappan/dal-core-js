import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js"
import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";


const showWorldState = (participants) => {
    console.log("World State:");
    for (const key in participants) {
        console.log(`Participant: ${key}, Value:`, participants[key].getValue());
    }
}

describe("parser tests", () => {

    it("tests a simple parser script", async () => {
        const p1 = new Participant({
            name: "book",
            description: "a book participant",
        });
        p1.setValue({"name": "BOOK1"});

        const p2 = new Participant({
            name: "shelf",
            description: "a shelf participant",
        });
        p2.setValue({});

        const participants = {book: p1, shelf: p2};
        showWorldState(participants);

        const parser = new BehavioralLanguageParser();

        parser.execute('set shelf book ["slotB"]', participants);
        showWorldState(participants);

        parser.execute('set shelf book ["slotC"]', participants);
        showWorldState(participants);
    });
});
