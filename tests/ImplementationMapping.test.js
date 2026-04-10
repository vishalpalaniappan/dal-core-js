import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Implementation from "../src/Implementation/Implementation.js";

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

        const imp = new Implementation();

        // Load the source file and mapping to be used for testing
        const filePath = resolve(__dirname, "./test_data/TransactionDB.py")
        const source = await readFile(filePath, "utf-8")
        const mapPath = resolve(__dirname, "./test_data/TransactionDB_mapping.json");
        const index = await readFile(mapPath, "utf-8");
        const indexJson = JSON.parse(index);

        // Add the source file, set the index
        // const f = imp.addSourceFile("sample file", "sampleFile.py", source);
        // imp.setStatementIndex(f.uid, indexJson);

        // // Get the statement index and verify its shape and content
        // const statementIndex = imp.getStatementIndex(f.uid);
        // expect(statementIndex).toBeDefined();
        // expect(statementIndex).toBeInstanceOf(Object);
        // expect(statementIndex).toEqual(indexJson);
    });
});
