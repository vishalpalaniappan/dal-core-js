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
            name: "TestBehavior",
            description: "",
        });

        const s = `
            pre:
                require book
                require book2 input
                require text
                invariant book hasKey [] ["name"] []
                invariant book minLength ["name"] [1] []

            transform:
                create book_name string
                create text_length number
                create is_length_correct null
                create expected_length number 5
                get book ["name"] book_name
                getLength text text_length
                isEqual text_length expected_length is_length_correct
                validate transformation

            post:
                require book_name
                require text_length
                require expected_length
                invariant book_name minLength [] [1] []

            next:
                create number1 number 5
                create is_length_correct string
                isEqual text_length number1 is_length_correct
                select AcceptName if is_length_correct
        `;
        b.setScript(s);

        b.setPreWorldState({
            text: "apple",
            book: {"name": "The Great Gatsby"},
        });

        b.setPostWorldState({
            book: {"name": "The Great Gatsby"},
            book_name: "The Great Gatsby",
        });

        b.setPrimitiveArgs({});

        const output =b.computeTransformations();

        const filePath2 = resolve(__dirname, "../temp/semanticEvaluatorOutput2.json")
        await writeFile(filePath2, JSON.stringify(output, null, 4));
    });
});
