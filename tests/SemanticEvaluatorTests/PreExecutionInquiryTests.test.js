import {writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Behavior from "../../src/Design/Behavior.js";
import SemanticEvaluator from "../../src/ExecutableModelTest/SemanticEvaluator.js";

describe("tests the requirement parsing for executing behavior", () => {

    it("tests the require semantic to see if it specifies conditions accurately", async () => {

        const rawScript = `
            pre:
                require book
                require book2 input
                require book3 ["name"] "Artimes Fowl"

            transform:

            post:
        `;
        const script = rawScript.split("\n")
            .map(line => line.trim()).filter(line => line.length > 0);


        const name_value = "The Great Gatsby";

        let initialWorldState = {
            book: {"name": name_value},
            book3: {"name": "Artimes Fowl"},
        };
        const expectedPostWorldState = {
            book: {"name": name_value},
        };

        const args = {
            book2: {"name": "To Kill a Mockingbird"},
        };

        const evaluator = new SemanticEvaluator(
            script, initialWorldState, expectedPostWorldState, args

        );

        evaluator.run();

        // console.log("Final world state:", evaluator.worldState);
        // console.log("Output:", evaluator.output);
        // expect(evaluator.worldState).toEqual(expectedPostWorldState);

        const filePath2 = resolve(__dirname, "../temp/semanticEvaluatorOutput.json")
        await writeFile(filePath2, JSON.stringify(evaluator.output, null, 4));
    });
});
