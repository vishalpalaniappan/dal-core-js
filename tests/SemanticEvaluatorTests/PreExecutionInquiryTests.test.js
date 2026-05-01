import {writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Behavior from "../../src/Design/Behavior.js";
import SemanticEvaluator from "../../src/Design/BehavioralLanguage/SemanticEvaluator.js";

describe("tests the requirement parsing for executing behavior", () => {

    it("tests the require semantic to see if it specifies conditions accurately", async () => {

        /**
         * This script specifies the following:
         * - The user's input for the book name must be accepted
         * - Book3 must be present in the world state with the name
         *   "Artimes Fowl" for this behavior to be valid.
         * - Book must be present in the world state (behavior will fail
         *   without it)
         *
         * No transform operations yet. Add them after verifying that the
         * require primitive is parsed correctly and conditions are checked
         * as expected.
         */

        // TODO: Currently, the require <participant> input statements have to
        // be first in the pre section. Otherwise, the evaluator does not
        // recognize them and this is not intentional, I have to fix this.
        const rawScript = `
            pre:
                require name input
                require selectedOption [] a

            transform:
                validate transformation

            post:
                require name
                invariant name minLength [] [1] ["getFirstLetterOfBookName"]
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
            name: "To Kill a Mockingbird",
        };

        const evaluator = new SemanticEvaluator(
            script, initialWorldState, expectedPostWorldState, args

        );

        evaluator.getPreExecutionMeta();

        console.log("Required inputs:", evaluator.requiredInputs);
        console.log(
            "Is world state valid for behavior?", evaluator.isWorldStateValidForBehaviorFlag
        );

        // evaluator.run();

        // console.log("Final world state:", evaluator.worldState);
        // console.log("Output:", evaluator.output);
        // expect(evaluator.worldState).toEqual(expectedPostWorldState);

        const filePath2 = resolve(__dirname, "../temp/semanticEvaluatorOutput.json")
        await writeFile(filePath2, JSON.stringify(evaluator.output, null, 4));
    });
});
