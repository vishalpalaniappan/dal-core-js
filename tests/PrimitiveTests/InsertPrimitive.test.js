import {describe, expect, it} from "vitest";

import InsertPrimitive from "../../src/BehaviorV2Test/SemanticPrimitives/InsertPrimitive.js";

describe("tests the insert primitive", () => {

    test("applies insert transformation without mutating preconditions", () => {
        const inputs = {
            targetParticipantName: "basket",
            key: "contents",
            valueParticipantName: "book",
            index: 0,
        };

        const preconditions = {
            basket: {
                contents: ["pen", "pencil"],
            },
            book: "notebook",
        };

        const postconditions = {
            basket: {
                contents: ["notebook", "pen", "pencil"],
            },
            book: "notebook",
        };

        const primitive = new InsertPrimitive(inputs, preconditions, postconditions);

        const expected = primitive.apply_transformations();

        expect(expected).toEqual({
            basket: {
                contents: ["notebook", "pen", "pencil"],
            },
            book: "notebook",
        });

        // Ensure original preconditions were not overwritten
        expect(preconditions).toEqual({
            basket: {
                contents: ["pen", "pencil"],
            },
            book: "notebook",
        });

        expect(primitive.expectedPostconditions).toEqual(expected);
        expect(primitive.evaluate_transformation_validity()).toBe(true);
    });
});
