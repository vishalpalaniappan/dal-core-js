import {writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Behavior from "../../src/Design/Behavior.js";
import SemanticEvaluator from "../../src/ExecutableModelTest/SemanticEvaluator.js";

describe("tests script runner", () => {

    it("tests the modes in the script runner", async () => {

        const rawScript = `
            pre:
                require book
                require book2 input
                invariant book hasKey [] ["name"] []
                invariant book minLength ["name"] [1] []

            transform:
                create book_name
                get book ["name"] book_name
                validate transformation

            post:
                require book_name
                invariant book_name minLength [] [1] []
        `;
        const script = rawScript.split("\n")
            .map(line => line.trim()).filter(line => line.length > 0);


        const name_value = "The Great Gatsby";

        let initialWorldState = {
            book: {"name": name_value},
        };
        const expectedPostWorldState = {
            book: {"name": name_value},
            book_name: name_value,
            book2: {"name": "To Kill a Mockingbird"},
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

    it("tests the transformation through the behavior", async () => {

        const b = new Behavior({
            name: "Test Behavior",
            description: "",
        });

        const s = `
            pre:
                require book
                require book2 input
                invariant book hasKey [] ["name"] []
                invariant book minLength ["name"] [1] []

            transform:
                create book_name
                get book ["name"] book_name
                validate transformation

            post:
                require book_name
                invariant book_name minLength [] [1] []
        `;
        b.setScript(s);

        b.setPreWorldState({
            book: {"name": "The Great Gatsby"},
        });

        b.setPostWorldState({
            book: {"name": "The Great Gatsby"},
            book_name: "The Great Gatsby",
        });

        b.setPrimitiveArgs({});

        const scriptOutput = b.computeTransformations();
        console.log("output:", scriptOutput);
    });
});
