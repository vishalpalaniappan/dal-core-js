import {writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Behavior from "../../src/Design/Behavior.js";

describe("tests synthesis meta output", () => {

    it("tests get primitive synthesis meta", async () => {

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

        const output = b.computeTransformations();

        const filePath2 = resolve(__dirname, "../temp/synthPackage.json")
        await writeFile(filePath2, JSON.stringify(output.output.synthPackage, null, 4));
    });

});
