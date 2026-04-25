import {describe, expect, it} from "vitest";

import BehavioralScriptRunner from "../../src/ExecutableModelTest/BehavioralScriptRunner.js";

describe("tests script runner", () => {

    it("tests the modes in the script runner", async () => {

        const rawScript = `
            pre:
                require book

            transform:
                create book_name
                get book ["name"] book_name

            post:
                exists book_name
        `;
        const script = rawScript.split("\n")
            .map(line => line.trim()).filter(line => line.length > 0);

        const initialWorldState = {
            book: {"name": "The Great Gatsby"},
        };
        const expectedPostWorldState = {
            book: {"name": "The Great Gatsby"},
            book_name: "The Great Gatsby",
        };

        const runner = new BehavioralScriptRunner(
            script, initialWorldState, expectedPostWorldState
        );
        runner.run();
    });
});
