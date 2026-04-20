import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js"
import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";

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
        console.log("World State:")
        for (const key in participants) {
            console.log(`Participant: ${key}, Value:`, participants[key].getValue());
        }

        console.log("\n---- Executing Script ----");
        const parser = new BehavioralLanguageParser();
        const updatedParticipants = parser.execute('set shelf book ["slotB"]', participants);
        console.log("---- Done Script----\n");

        console.log("World State:")
        for (const key in updatedParticipants) {
            console.log(`Participant: ${key}, Value:`, updatedParticipants[key].getValue());
        }
    });
});
