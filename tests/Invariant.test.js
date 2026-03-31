// eslint-disable-next-line no-unused-vars
import { readFile, unlink, writeFile } from "fs/promises"
import { resolve } from "path"
import { describe, expect, it } from "vitest";

import { DALEngine } from "../src/DALEngine.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";

describe("invariantTests", () => {

    it("invariant throws on missing attributes", () => {
        let d = new DALEngine({ name: "Library Manager" });
        const invariant = d.createInvariant({ name: "Book Title Length", "rule": "" });
        invariant.assignInvariantType(d.invariant_types.MIN_LENGTH);
        expect(invariant.invariantType.label).toBe("Minimum Length");
    });

    it("tests min length invariant", () => {
        let d = new DALEngine({name: "Library Manager"});
        const minLengthInvariant = new d.invariant_types.MIN_LENGTH();
        minLengthInvariant.properties.keys.value = ["title"];
        minLengthInvariant.properties.minLength.value = 1;
        const state1 = {title: "Harry Potter"};
        const state2 = {title: ""};
        expect(minLengthInvariant.evaluate(state1)).toBe(false);
        expect(minLengthInvariant.evaluate(state2)).toBe(true);
    });


    it ("tests invariants assigned to participant", () => {
        let d = new DALEngine({name: "Library Manager"});
        const minLengthInvariant = new d.invariant_types.MIN_LENGTH();
        minLengthInvariant.properties.keys.value = ["title"];
        minLengthInvariant.properties.minLength.value = 1;

        const participant = d.createParticipant({name: "Book"});
        participant.setValue({title: "Harry Potter"});
        participant.addInvariant(minLengthInvariant);
        participant.evaluateInvariants();
        expect(participant._invariantViolated).toBe(false);
    });
})
