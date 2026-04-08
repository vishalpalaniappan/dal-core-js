import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import { describe, expect, it } from "vitest";

import { DALEngine } from "../src/DALEngine.js";

describe("Implementation Mapping Tests", () => {

    it("adds statement index to an implementation", async () => {
        // A source file is parsed to extract its statements by line number,
        // the generated mapping is the statement index. This test adds the
        // statement index to the implementation:
        // - The mapping JSON file is passed into a statement index object.
        // - The statement index object consists of a series of entries.
        // - Each entry contains a map object that can be used to assign
        //   a behavior, or variable to it.
        // This test verifies that the statement object is created and that
        // it creates a map for each statement in the source file.
    });
});
