import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js"
import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";

describe("parser tests", () => {

    it("tests a simple parser script", async () => {
        const p1 = new Participant({
            name: "book",
            description: "a book participant",
        });
        p1.setValue("BOOK1");

        const p2 = new Participant({
            name: "shelf",
            description: "a shelf participant",
        });
        p2.setValue({});

        const participants = {book: p1, shelf: p2};

        const parser = new BehavioralLanguageParser();
        parser.execute('set book shelf ["key1"]', participants);
    });
});
