// eslint-disable-next-line no-unused-vars
import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import {DALEngine} from "../src/DALEngine.js";
import MissingAttributes from "../src/Errors/MissingAttributes.js";

describe("invariantTests", () => {

    it("invariant throws on missing attributes", () => {
        let d = new DALEngine({name: "Library Manager"});
        expect(() => {d.createInvariant({"name": "asdf"})}).toThrow(MissingAttributes);
        expect(() => {d.createInvariant({})}).toThrow(MissingAttributes);
        expect(() => {d.createInvariant()}).toThrow(MissingAttributes);
    });
})
