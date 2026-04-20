import {describe, expect, it} from "vitest";

import Participant from "../../src/Design/Participant.js";
import InsertPrimitive from "../../src/ExecutableModelTest/SemanticPrimitives/InsertPrimitive.js";

const createParticipant = (name, value) => {
    const participant = new Participant({name: name, description: ""});
    participant.setValue(value);
    return participant;
}

describe("tests the insert primitive", () => {

    it("applies insert transformation without mutating preconditions", () => {
        const inputs = {
            targetParticipantName: "basket",
            key: "contents",
            valueParticipantName: "book",
            index: 0,
        };

        const preconditions = {
            basket: createParticipant("basket", {"contents": ["pen", "pencil"]}),
            book: createParticipant("book", "notebook"),
        };

        const postconditions = {
            basket: createParticipant("basket", {"contents": ["notebook", "pen", "pencil"]}),
            book: createParticipant("book", "notebook"),
        };

        const primitive = new InsertPrimitive(inputs, preconditions, postconditions);

        const expected = primitive.apply_transformations();

        expect(expected.basket._value).toEqual({
            contents: ["notebook", "pen", "pencil"],
        });

        // Ensure original preconditions were not overwritten
        expect(preconditions.basket._value).toEqual({contents: ["pen", "pencil"]});
        expect(preconditions.book._value).toBe("notebook");

        expect(primitive.expectedPostconditions).toEqual(expected);
        expect(primitive.evaluate_transformation_validity()).toBe(true);
    });
});
