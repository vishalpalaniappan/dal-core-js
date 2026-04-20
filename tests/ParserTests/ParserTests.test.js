import {describe, expect, it} from "vitest";

import BehavioralLanguageParser from "../../src/ExecutableModelTest/BehavioralLanguageParser.js";
import Participant from "../../src/Design/Participant.js"

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

        const parser = new BehavioralLanguageParser();
        parser.parse('set book shelf ["key1"]');
    });
});
