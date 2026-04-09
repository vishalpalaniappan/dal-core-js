import {readFile, unlink, writeFile} from "fs/promises"
import {resolve} from "path"
import {describe, expect, it} from "vitest";

import ImplementationV2 from "../../src/Implementation/ImplementationV2";

const getFiles = async () => {
    const filePath = resolve(__dirname, "../test_data/TransactionDB.py")
    const source = await readFile(filePath, "utf-8");
    const mapPath = resolve(__dirname, "../test_data/TransactionDB_mapping.json");
    const index = await readFile(mapPath, "utf-8");
    const indexJson = JSON.parse(index);
    return {source, indexJson, filePath};
}

describe("implementation tests", () => {

    it("creates implementation, adds source file and gets source file by UID", async () => {
        const {source, indexJson, filePath} = await getFiles();

        const imp = new ImplementationV2();
        const f = imp.addFile("TransactionDB.py", filePath, source);
        imp.setStatementIndexForFile(f._uid, indexJson);

        const retrievedFile = imp.getFile(f._uid);
        expect(retrievedFile).toBeDefined();
        expect(retrievedFile.getPath()).toEqual(filePath);
    });
});