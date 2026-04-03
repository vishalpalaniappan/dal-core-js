// eslint-disable-next-line no-unused-vars
import { readFile, unlink, writeFile } from "fs/promises"
import { resolve } from "path"
import { describe, expect, it } from "vitest";

import { DALEngine } from "../src/DALEngine.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";

describe("invariantTests", () => {

    it("invariant throws on missing attributes", () => {
        let d = new DALEngine({ name: "Library Manager", description: "Manages the library"});
        const invariant = d.createInvariant({
            name: "Book Title Length", 
            description: "Ensures that the book title has at least a certain number of characters" 
        });
        invariant.assignInvariantType(new d.invariant_types.MIN_LENGTH());
        expect(invariant.invariantType.label).toBe("Minimum Length");
    });

    it("tests min length invariant", () => {
        let d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        const minLengthInvariant = new d.invariant_types.MIN_LENGTH();
        minLengthInvariant.properties.keys.value = ["title"];
        minLengthInvariant.properties.minLength.value = 1;
        const state1 = {title: "Harry Potter"};
        const state2 = {title: ""};
        minLengthInvariant.evaluate(state1)
        expect(minLengthInvariant.isViolated()).toBe(false);
        expect(minLengthInvariant.evaluate(state2)).toBe(true);
    });


    it ("tests invariants assigned to participant", () => {
        let d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        const minLengthInvariant = new d.invariant_types.MIN_LENGTH();
        minLengthInvariant.properties.keys.value = ["title"];
        minLengthInvariant.properties.minLength.value = 1;

        const participant = d.createParticipant({
            name: "Book",
            description: "Represents a book in the library"
        });
        participant.setValue({title: "Harry Potter"});
        const inv = d.createInvariant({
            name: "Book Title Length",
            description: "Ensures that the book title has at least a certain number of characters",
        });
        inv.assignInvariantType(minLengthInvariant);
        participant.addInvariant(inv);
        participant.evaluateInvariants();
        expect(participant._invariantViolated).toBe(false);
    });

    it ("tests invariants being removed", () => {
        let d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        const minLengthInvariant = new d.invariant_types.MIN_LENGTH();
        minLengthInvariant.properties.keys.value = ["title"];
        minLengthInvariant.properties.minLength.value = 1;

        const invariant = d.createInvariant({
            name: "Book Title Length",
            description: "Ensures that the book title has at least a certain number of characters",
        });
        invariant.assignInvariantType(minLengthInvariant);

        const participant = d.createParticipant({
            name: "Book",
            description: "Represents a book in the library"
        });
        participant.setValue({title: "Harry Potter"});
        participant.addInvariant(invariant);
        participant.evaluateInvariants();
        expect(participant._invariantViolated).toBe(false);
        expect(participant.getInvariants().length).toBe(1);
        participant.removeInvariant(invariant);
        expect(participant.getInvariants().length).toBe(0);
    });

    it ("throws error if invariant already eixsts", () => {
        let d = new DALEngine({name: "Library Manager", description: "Manages the library"});
        const invariant = d.createInvariant({
            name: "Book Title Length",
            description: "Ensures that the book title has at least a certain number of characters",
        });
        invariant.assignInvariantType(new d.invariant_types.MIN_LENGTH());

        const participant = d.createParticipant({
            name: "Book",
            description: "Represents a book in the library"
        });
        participant.setValue({title: "Harry Potter"});
        participant.addInvariant(invariant);
        expect(() => participant.addInvariant(invariant)).toThrow();
    });
})
