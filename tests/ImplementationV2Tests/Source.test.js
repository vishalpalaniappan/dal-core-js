import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import Map from "../../src/Implementation/Map";
import Source from "../../src/Implementation/Source";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(filePath, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, filePath};
}

describe("source tests", () => {

    it("creates a source object, sets content and statement index", async () => {
        // Load the source file and mapping to be used for testing
        const {source, indexJson, filePath} = await getFiles();

        // Create a source object with the required attributes
        const s = new Source({uid: "source1"});

        // Set the content and statement index of the source object
        s.setContent(source);
        s.addStatementIndex(indexJson);

        // Get the content and statement index and verify
        // their shape and content
        const content = s.getContent();
        const statementIndex = s.getStatementIndex();

        expect(content).toBe(source);
        expect(statementIndex).toBeDefined();
        expect(statementIndex).toBeInstanceOf(Object);

        const entry = s.getStatementIndexEntryByUid(indexJson[0].uid);
        expect(entry).toBeDefined();
        expect(entry).toBeInstanceOf(Map);
    });

});
