// eslint-disable-next-line no-unused-vars
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";

describe("invariantTests", () => {

    it("invariant throws on missing attributes", () => {
        let d = new DALEngine({name: "Library Manager"});
        const invariant =d.createInvariant({name: "Book Title Length", "rule": ""});
        invariant.assignInvariantType(d.invariant_types.MIN_LENGTH);
        expect(invariant.invariantType.label).toBe("Minimum Length");
    });
})
