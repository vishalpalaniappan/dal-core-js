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

        primitive.apply_transformations();
    });
});
