import {describe, expect, it} from "vitest";

import SemanticEvaluator from "../../src/ExecutableModelTest/SemanticEvaluator.js";

describe("tests script runner", () => {

    it("tests the modes in the script runner", async () => {

        const rawScript = `
            pre:
                require book
                require book2 input
                invariant book hasKey ["name"] []

            transform:
                create book_name
                get book ["name"] book_name

            post:
                exists book_name
        `;
        const script = rawScript.split("\n")
            .map(line => line.trim()).filter(line => line.length > 0);

        let initialWorldState = {
            book: {"name": "The Great Gatsby"},
        };
        const expectedPostWorldState = {
            book: {"name": "The Great Gatsby"},
            book_name: "The Great Gatsby",
        };

        const evaluator = new SemanticEvaluator(
            script, initialWorldState, expectedPostWorldState
        );

        evaluator.run();

        console.log("Final world state:", evaluator.worldState);
        expect(evaluator.worldState).toEqual(expectedPostWorldState);

        console.log("Output:", evaluator.output);
    });
});
